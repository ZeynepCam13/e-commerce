using API.Data;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class CartController : ControllerBase
{
    private readonly DataContext _context;

    public CartController(DataContext context)
    {
        _context = context;
    }

    // 🔹 SEPETİ GETİR
    [HttpGet]
    public async Task<ActionResult<CartDTO>> GetCart()
    {
        var cart = await GetOrCreate(GetCustomerId());
        return CartToDTO(cart);
    }

    // 🔹 SEPETE EKLE (BEDEN + RENK DESTEKLİ)
    [HttpPost]
    public async Task<ActionResult> AddItemToCart(
        int productId,
        int quantity,
        string size,
        int? colorId
    )
    {
        var cart = await GetOrCreate(GetCustomerId());

        var product = await _context.Products
            .Include(p => p.ProductSizes)
            .Include(p => p.ProductColors)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
            return NotFound("Ürün bulunamadı");

        cart.AddItem(product, quantity, size,colorId);

        var result = await _context.SaveChangesAsync() > 0;

        if (result)
            return CreatedAtAction(nameof(GetCart), CartToDTO(cart));

        return BadRequest(new ProblemDetails
        {
            Title = "Ürün sepete eklenemedi"
        });
    }

    // 🔹 SEPETTEN SİL (BEDEN + RENK DESTEKLİ)
    [HttpDelete]
    public async Task<ActionResult> DeleteItemFromCart(
        int productId,
        int quantity,
        string size,
        int? colorId
    )
    {
        var cart = await GetOrCreate(GetCustomerId());

        cart.DeleteItem(productId, quantity, size, colorId);

        var result = await _context.SaveChangesAsync() > 0;

        if (result)
            return CreatedAtAction(nameof(GetCart), CartToDTO(cart));

        return BadRequest(new ProblemDetails
        {
            Title = "Sepetten ürün silinemedi"
        });
    }

    // =======================
    // 🔹 YARDIMCI METOTLAR
    // =======================

    private string GetCustomerId()
    {
        return User.Identity?.Name ?? Request.Cookies["customerId"]!;
    }

    private async Task<Cart> GetOrCreate(string customerId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(i => i.Product)
            .Include(c => c.CartItems)
                .ThenInclude(i => i.Color)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId);

        if (cart != null) return cart;

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

        return cart;
    }

    // 🔹 CART → DTO
    private CartDTO CartToDTO(Cart cart)
    {
        return new CartDTO
        {
            CartId = cart.CartId,
            CustomerId = cart.CustomerId,
            CartItems = cart.CartItems.Select(item => new CartItemDTO
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                ImageUrl = item.Product.ImageUrl,
                Quantity = item.Quantity,
                Price = item.Product.Price,
                OriginalPrice = item.Product.OriginalPrice ?? item.Product.Price,
                Discount = item.Product.Discount,
                Size = item.Size,

                // 🔵 RENK
                ColorId = item.ColorId,
                ColorName = item.Color?.ColorName,
                ColorCode = item.Color?.ColorCode
            }).ToList()
        };
    }
}
