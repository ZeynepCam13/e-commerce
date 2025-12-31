using API.Data;
using API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        var text = (dto.Message ?? "").ToLower();

        // =========================
        // ✅ 1) AUTH + USER
        // =========================
        bool wantsOrders = text.Contains("sipariş");
        if (wantsOrders)
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Ok(new { type = "text", message = "Siparişlerinizi görmek için önce giriş yapmanız gerekiyor." });

            var userId = User.Identity!.Name;
            if (string.IsNullOrWhiteSpace(userId))
                return Ok(new { type = "text", message = "Kullanıcı kimliğiniz doğrulanamadı." });

            // Tek sorgu: siparişleri çek
            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            if (!orders.Any())
                return Ok(new { type = "text", message = "Henüz bir siparişiniz bulunmuyor." });

            // =========================
            // ✅ 2) SORU TİPLERİ (ÖNCE BUNLAR)
            // =========================

            // 2.1 Tamamlanan hangisi?
            if (text.Contains("hangisi") && (text.Contains("tamamlandı") || text.Contains("tamamlanan")))
            {
                var completed = orders
                    .Where(o => o.OrderStatus.ToString().ToLower().Contains("completed")
                             || o.OrderStatus.ToString().ToLower().Contains("tamam")) // enum TR/EN farkına dayanıklı
                    .Select(o => new
                    {
                        id = o.Id,
                        status = o.OrderStatus.ToString(),
                        total = o.GetTotal(),
                        orderDate = o.OrderDate.ToString("dd.MM.yyyy")
                    })
                    .ToList();

                var prompt = $@"
Kullanıcı şu soruyu sordu:
""{dto.Message}""

Aşağıda kullanıcının siparişleri var:
{string.Join("\n", completed.Select(o =>
$"- Sipariş #{o.id}, Durum: {o.status}, Tutar: {o.total} TL, Tarih: {o.orderDate}"))}

Buna samimi, satış danışmanı gibi Türkçe cevap ver.
Önce kısa bir cümleyle yorum yap, sonra listeyi göster.
";

var aiText = await AiTextHelper.GenerateAsync(
    HttpContext.RequestServices
        .GetRequiredService<IConfiguration>()["OpenAI:ApiKey"]!,
    prompt
);

return Ok(new
{
    type = "orders",
    message = aiText,
    orders = completed
});

            }

            // 2.2 En pahalı sipariş?
            if (text.Contains("en pahalı") || (text.Contains("hangisi") && text.Contains("pahalı")))
            {
                var max = orders.OrderByDescending(o => o.GetTotal()).First();

                return Ok(new
                {
                    type = "text",
                    message = $"En pahalı siparişin #{max.Id}. Durum: {max.OrderStatus}. Toplam: {max.GetTotal():0.##} TL (Tarih: {max.OrderDate:dd.MM.yyyy})."
                });
            }

            // 2.3 Son sipariş?
            if (text.Contains("son sipariş"))
            {
                var last = orders.First();

                return Ok(new
                {
                    type = "text",
                    message = $"Son siparişin #{last.Id}. Durum: {last.OrderStatus}. Toplam: {last.GetTotal():0.##} TL (Tarih: {last.OrderDate:dd.MM.yyyy})."
                });
            }

            // 2.4 Sipariş durumu sorusu? (ör: “siparişim onaylandı mı”)
            if (text.Contains("durum") || text.Contains("onay") || text.Contains("kargo") || text.Contains("iptal"))
            {
                var last = orders.First();
                return Ok(new
                {
                    type = "text",
                    message = $"Sipariş durumuna göre konuşalım: En güncel siparişin #{last.Id} ve şu an **{last.OrderStatus}** görünüyor."
                });
            }

            // =========================
            // ✅ 3) EN SON: GENEL LİSTE
            // =========================
            var list = orders
                .Take(5)
                .Select(o => new
                {
                    id = o.Id,
                    status = o.OrderStatus.ToString(),
                    total = o.GetTotal(),
                    orderDate = o.OrderDate.ToString("dd.MM.yyyy")
                })
                .ToList();

            return Ok(new
            {
                type = "orders",
                message = "Siparişlerinin genel durumu aşağıdadır:",
                orders = list
            });
        }

        // =========================
        // ✅ ÜRÜN ARAMA
        // =========================
        foreach (var key in CategoryMap.Keys)
        {
            if (text.Contains(key))
            {
                var categoryName = CategoryMap[key];

                var products = await _context.Products
                    .Include(p => p.Images)
                    .Include(p => p.subSubCategory)
                    .Where(p => p.IsActive &&
                           (p.subSubCategory != null && p.subSubCategory.Name.ToLower() == categoryName.ToLower()
                            || p.Name.ToLower().Contains(key)))
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
                    products
                });
            }
        }

        // =========================
        // ✅ KOMBİN ÖNERİSİ (şimdilik basit)
        // =========================
        if (text.Contains("üstüne") || text.Contains("kombin"))
        {
            var products = await _context.Products
                .Include(p => p.subSubCategory)
                .Include(p => p.Images)
                .Where(p => p.IsActive &&
                    p.subSubCategory != null &&
                    (p.subSubCategory.Name == "Kazak" || p.subSubCategory.Name == "Gömlek" || p.subSubCategory.Name == "Tişört"))
                .OrderBy(x => Guid.NewGuid())
                .Take(4)
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
