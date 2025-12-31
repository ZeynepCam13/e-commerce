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

        // 🔹 SİPARİŞLERİM BLOĞUNU GÜNCELLE
// 🔹 SİPARİŞLERİM BLOĞU - GÜNCEL HALİ
if (text.Contains("sipariş"))
{
    if (!User.Identity.IsAuthenticated)
        return Ok(new { type = "text", message = "Siparişlerinizi listelemem için önce giriş yapmanız gerekiyor." });

    // Kullanıcı ID'sini almak için birden fazla yöntem deneyelim
    var userId = User.Identity!.Name

                 ?? User.FindFirst("nameid")?.Value 
                 ?? User.FindFirst("sub")?.Value;

    if (string.IsNullOrEmpty(userId))
    {
        return Ok(new { type = "text", message = "Kullanıcı kimliğiniz doğrulanamadı." });
    }

    var orders = await _context.Orders
        .Where(o => o.CustomerId == userId) // ⚠️ Veritabanındaki CustomerId ile userId tipinin aynı olduğundan emin ol (string vs int)
        .OrderByDescending(o => o.OrderDate)
        .Take(5)
        .Select(o => new
        {
            id = o.Id,
            status = o.OrderStatus.ToString(),
            total = o.GetTotal(),
            orderDate = o.OrderDate.ToString("dd.MM.yyyy")
        })
        .ToListAsync();

    if (!orders.Any())
    {
        // Eğer hala gelmiyorsa, userId'yi mesajda göstererek debug yapabilirsin:
        // return Ok(new { type = "text", message = $"Sistemdeki ID'niz: {userId}, ancak sipariş bulunamadı." });
        return Ok(new { type = "text", message = "Henüz bir siparişiniz bulunmuyor." });
    }

    return Ok(new
    {
        type = "orders",
        message = "Son 5 siparişiniz aşağıdadır:",
        orders = orders
    });
}

       
        // 🔹 ÜRÜN ARAMA BÖLÜMÜ (Kopyala-Yapıştır)
foreach (var key in CategoryMap.Keys)
{
    if (text.Contains(key))
    {
        var categoryName = CategoryMap[key];

        var products = await _context.Products
            .Include(p => p.Images) // Resimler için şart
            .Include(p => p.subSubCategory) // KATEGORİ İSMİ İÇİN BU SATIR ŞART!
            .Where(p => p.IsActive && 
                   (p.subSubCategory.Name.ToLower() == categoryName.ToLower() || 
                    p.Name.ToLower().Contains(key))) // Hem kategori hem isimde ara
            .Take(6)
            .Select(p => new
            {
                id = p.Id,
                name = p.Name,
                price = p.Price,
                imageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
            })
            .ToListAsync();

        return Ok(new
        {
            type = "products",
            message = products.Any() ? $"{categoryName} ürünleri:" : "Maalesef uygun ürün bulamadım.",
            products = products
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
