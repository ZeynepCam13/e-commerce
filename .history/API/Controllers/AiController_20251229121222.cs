using API.Data;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly DataContext _context;

    public AiController(DataContext context)
    {
        _context = context;
    }

    private static readonly Dictionary<string, string> CategoryMap = new()
    {
        { "kazak", "Kazak" },
        { "pantolon", "Pantolon" },
        { "gömlek", "Gömlek" },
        { "tişört", "Tişört" },
        { "elbise", "Elbise" }
    };

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequestDto dto)
    {
        var text = dto.Message.ToLower();

        // 🔹 SİPARİŞLERİM
        if (text.Contains("sipariş"))
        {
            if (!User.Identity.IsAuthenticated)
                return Ok(new
                {
                    type = "text",
                    message = "Siparişlerinizi görmek için giriş yapmalısınız."
                });

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    o.Id,
                    Status=o.OrderStatus.ToString(),
                    Total=o.GetTotal(),
                    CreatedAt=o.OrderDate
                })
                .ToListAsync();

            return Ok(new
            {
                type = "orders",
                message = "Son siparişleriniz:",
                orders
            });
        }

       
        
        // 🔹 ÜRÜN ARAMA (Daha esnek arama ve log ekleme)
foreach (var key in CategoryMap.Keys)
{
    if (text.Contains(key))
    {
        var categoryName = CategoryMap[key];

        var products = await _context.Products
            .Where(p => p.IsActive && 
                   (p.subSubCategory.Name.ToLower() == categoryName.ToLower() || 
                    p.Name.ToLower().Contains(key))) // Sadece kategori değil, isimde de ara
            .Include(p => p.Images)
            .Take(6)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                // Localhost'ta resimlerin görünmesi için tam URL gerekebilir
                ImageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
            })
            .ToListAsync();

       return Ok(new
{
    type = "products",
    message = "Kazak ürünleri:",
    products = products.Select(p => new {
        id = p.Id,         // 'id' olarak küçük harfle gönderin
        name = p.Name,     // 'name'
        price = p.Price,   // 'price'
        imageUrl = p.ImageUrl // 'imageUrl'
    }).ToList()
});
    }
}

        // 🔹 KOMBİN ÖNERİSİ
        if (text.Contains("üstüne") || text.Contains("kombin"))
        {
            var products = await _context.Products
                .Where(p => p.IsActive &&
                    (p.subSubCategory.Name == "Kazak" ||
                     p.subSubCategory.Name == "Gömlek" ||
                     p.subSubCategory.Name == "Tişört"))
                .Include(p => p.Images)
                .OrderBy(x => Guid.NewGuid())
                .Take(4)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    ImageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
                })
                .ToListAsync();

            return Ok(new
            {
                type = "products",
                message = "Bunlar uyumlu olabilir:",
                products
            });
        }

        return Ok(new
        {
            type = "text",
            message = "Kazak arıyorum, kombin öner veya siparişlerim yazabilirsin."
        });
    }
}
