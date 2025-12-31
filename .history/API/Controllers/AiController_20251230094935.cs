using API.Data;
using API.Dtos;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IConfiguration _config;

    public AiController(DataContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
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
        var apiKey = _config["OpenAI:ApiKey"]!;

        /* =========================================================
         * 🧾 SİPARİŞLER
         * ========================================================= */
        if (text.Contains("sipariş"))
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Ok(new { type = "text", message = "Siparişlerini görüntüleyebilmem için önce giriş yapmalısın." });

            var userId = User.Identity!.Name;
            if (string.IsNullOrWhiteSpace(userId))
                return Ok(new { type = "text", message = "Kullanıcı bilgini doğrulayamadım." });

            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            if (!orders.Any())
                return Ok(new { type = "text", message = "Henüz oluşturulmuş bir siparişin yok." });

            var orderDtos = orders.Select(o => new
            {
                id = o.Id,
                status = o.OrderStatus.ToString(),
                total = o.GetTotal(),
                orderDate = o.OrderDate.ToString("dd.MM.yyyy")
            }).ToList();

            // 🔹 Prompt (Mini ChatGPT davranışı)
            var prompt = $@"
Sen deneyimli bir e-ticaret satış danışmanısın.
Kullanıcının sorusunu analiz et ve aşağıdaki sipariş bilgilerine bakarak DOĞAL, SAMİMİ, insan gibi Türkçe cevap ver.

Kullanıcının sorusu:
""{dto.Message}""

Siparişler:
{string.Join("\n", orderDtos.Select(o =>
$"- #{o.id} | {o.status} | {o.total} TL | {o.orderDate}"))}

Kurallar:
- Önce kısa bir yorum cümlesi yaz
- Gerekliyse sipariş numarası ve durumu belirt
- Gereksiz tekrar yapma
";

            var aiText = await AiTextHelper.GenerateAsync(apiKey, prompt);

            return Ok(new
            {
                type = "orders",
                message = aiText,
                orders = orderDtos
            });
        }

        /* =========================================================
         * 🛍 ÜRÜN ARAMA
         * ========================================================= */
        foreach (var key in CategoryMap.Keys)
        {
            if (text.Contains(key))
            {
                var categoryName = CategoryMap[key];

                var products = await _context.Products
                    .Include(p => p.Images)
                    .Include(p => p.subSubCategory)
                    .Where(p =>
                        p.IsActive &&
                        p.subSubCategory != null &&
                        p.subSubCategory.Name == categoryName)
                    .Take(6)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        price = p.Price,
                        imageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
                    })
                    .ToListAsync();

                var prompt = $@"
Sen bir stil danışmanısın.
Kullanıcı şu istekte bulundu:
""{dto.Message}""

Aşağıdaki ürünleri incele ve doğal bir açıklama yap:
{string.Join("\n", products.Select(p => $"- {p.name} ({p.price} TL)"))}

Kurallar:
- Kısa ve samimi yaz
- Satış danışmanı gibi konuş
";

                var aiText = await AiTextHelper.GenerateAsync(apiKey, prompt);

                return Ok(new
                {
                    type = "products",
                    message = aiText,
                    products
                });
            }
        }

        /* =========================================================
         * 👗 KOMBİN
         * ========================================================= */
        if (text.Contains("kombin") || text.Contains("üstüne"))
        {
            var products = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.subSubCategory)
                .Where(p =>
                    p.IsActive &&
                    p.subSubCategory != null &&
                    (p.subSubCategory.Name == "Kazak" ||
                     p.subSubCategory.Name == "Gömlek" ||
                     p.subSubCategory.Name == "Tişört"))
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

            var prompt = $@"
Sen bir moda danışmanısın.
Kullanıcı şunu sordu:
""{dto.Message}""

Bu ürünlerle uyumlu, stil önerisi içeren kısa bir açıklama yap.
";

            var aiText = await AiTextHelper.GenerateAsync(apiKey, prompt);

            return Ok(new
            {
                type = "products",
                message = aiText,
                products
            });
        }

        /* =========================================================
         * 🤖 FALLBACK
         * ========================================================= */
        return Ok(new
        {
            type = "text",
            message = "İstersen ürün arayabilir, kombin isteyebilir ya da siparişlerini sorabilirsin."
        });
    }
}
