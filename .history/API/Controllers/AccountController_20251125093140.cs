using API.Data;
using API.DTO;
using API.Entity;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly DataContext _context;
    private readonly RoleManager<AppRole> _roleManager;
    private readonly IEmailService _emailService;



    public AccountController(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, TokenService tokenService, DataContext context,IEmailService emailService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _context = context;
        _roleManager = roleManager;
        _emailService=emailService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);

        if (user == null)
        {
            return BadRequest(new ProblemDetails { Title = "username hatalı" });
        }

        var result = await _userManager.CheckPasswordAsync(user, model.Password);

        if (result)
        {
             if (!user.EmailConfirmed)
              return BadRequest("Lütfen önce e-posta doğrulaması yapın.");
          
            var userCart = await GetOrCreate(model.UserName);
            var cookieCart = await GetOrCreate(Request.Cookies["customerId"]!);

            if (userCart != null)
            {
                foreach (var item in userCart.CartItems)
                {
                    cookieCart.AddItem(item.Product, item.Quantity);
                }
                _context.Carts.Remove(userCart);
            }
            cookieCart.CustomerId = model.UserName;
            await _context.SaveChangesAsync();


            return Ok(new UserDTO
            {
                Name = user.Name!,
                Token = await _tokenService.GenerateToken(user)
            });
        }

        return Unauthorized();
    }
    
     private async Task<Cart> GetOrCreate(string custId)
    {
        var cart = await _context.Carts
                    .Include(i => i.CartItems)
                    .ThenInclude(i => i.Product)
                    .Where(i => i.CustomerId == custId)
                    .FirstOrDefaultAsync();

        if (cart == null)
        {
            var customerId = User.Identity?.Name;

            if (string.IsNullOrEmpty(customerId))
            {
                customerId = Guid.NewGuid().ToString();

                var cookieOptions = new CookieOptions
                {
                  Expires = DateTime.Now.AddMonths(1),
                  IsEssential = true
                };

                Response.Cookies.Append("customerId", customerId, cookieOptions);
                
            }

            
            cart = new Cart { CustomerId = customerId };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }

    [HttpPost("register")]
    public async Task<IActionResult> CreateUser(RegisterDTO model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new AppUser
        {
            Name = model.Name,
            UserName = model.UserName,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
             //otp kodunu ekleyeceğiz,random üretiliyor
                  var otp=new Random().Next(100000,999999).ToString();
                  //süre ayarı 
                  user.OtpExpireTime=DateTime.UtcNow.AddMinutes(5);
                  user.OtpCode=otp;
                  //database kaydet
                  await _userManager.UpdateAsync(user);
                  //mail gönder 
                  await _emailService.SendEmailAsync(
                    user.Email!,
                    "E-posta Doğrulama Kodu",
                    $"Doğrulama kodunuz:{otp}"
                  );
            if (!await _roleManager.RoleExistsAsync("Customer"))
                {
                  await _roleManager.CreateAsync(new AppRole { Name = "Customer" });
                }

            await _userManager.AddToRoleAsync(user, "Customer");
            return StatusCode(201);
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult>VerifyEmail(VerifyEmailDTO model)
    {
        //kullanıcıyı buluyoruz
        var user=await _userManager.FindByEmailAsync(model.Email);

        if(user==null)
           return BadRequest("kullanıcı bulunamadı");
        //otpnin süresini kontrol ediyoruz
        if(user.OtpExpireTime<DateTime.UtcNow)
            return BadRequest("Kodun süresi doldu.Yeni bir kod alın");
        //kod doğru mu
        if(user.OtpCode !=model.Code)
           return BadRequest("Doğrulama kodu geçersiz.");

        //kod doğruysa maili onayla
        user.EmailConfirmed=true;
        //otp kodunu temizle
        user.OtpCode=null;
        user.OtpExpireTime=null;

        await _userManager.UpdateAsync(user);

        return Ok("E-posta başarıyla doğrulandı");
    }


    [Authorize]
    [HttpGet("getuser")]
    public async Task<ActionResult<UserDTO>> GetUser()
    {
        var user = await _userManager.FindByNameAsync(User.Identity?.Name!);

        if (user == null)
        {
            return BadRequest(new ProblemDetails { Title = "username ya da parola hatalı" });
        }

        return new UserDTO
        {
            Name = user.Name!,
            Token = await _tokenService.GenerateToken(user)
        };
    }


}