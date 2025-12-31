using API.Data;
using API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace API.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AiController(DataContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
        _httpClient = new HttpClient();
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

        // 🔹 SİPARİŞLER (AI YORUMLU)
        if (text.Contains("sipariş"))
        {
            if (!User.Identity!.IsAuthenticated)
                return Ok(new { type = "text", message = "Siparişlerinizi görüntülemek için giriş yapmanız gerekiyor." });

            var userId = User.Identity!.Name;

            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    id = o.Id,
                    status = o.OrderStatus.ToString(),
                    total = o.GetTotal(),
                    date = o.OrderDate.ToString("dd.MM.yyyy")
                })
                .ToListAsync();

            if (!orders.Any())
            {
                return Ok(new { type = "text", message = "Henüz bir siparişiniz bulunmuyor." });
            }

            var aiComment = await GenerateOrderComment(dto.Message, orders);

            return Ok(new
            {
                type = "orders",
                message = aiComment, // 🔥 AI YORUMU
                orders = orders      // 🔹 Ham veri (UI için)
            });
        }

        // 🔹 ÜRÜN ARAMA
        foreach (var key in CategoryMap.Keys)
        {
            if (text.Contains(key))
            {
                var categoryName = CategoryMap[key];

                var products = await _context.Products
                    .Include(p => p.Images)
                    .Include(p => p.subSubCategory)
                    .Where(p => p.IsActive &&
                        (p.subSubCategory!.Name.ToLower() == categoryName.ToLower()
                         || p.Name!.ToLower().Contains(key)))
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
                    message = products.Any()
                        ? $"{categoryName} kategorisinden sizin için seçtiklerim:"
                        : "Bu kategori için uygun ürün bulamadım.",
                    products
                });
            }
        }

        // 🔹 KOMBİN
        if (text.Contains("kombin") || text.Contains("üstüne"))
        {
            var products = await _context.Products
                .Include(p => p.Images)
                .Where(p => p.IsActive &&
                    (p.subSubCategory!.Name == "Kazak"
                     || p.subSubCategory.Name == "Gömlek"
                     || p.subSubCategory.Name == "Tişört"))
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
                message = "Bu parçalar birlikte oldukça şık durabilir:",
                products
            });
        }

        return Ok(new
        {
            type = "text",
            message = "Ürün arayabilir, kombin isteyebilir veya siparişlerinizi sorabilirsiniz."
        });
    }

    // 🔥 GPT YORUM METODU
    private async Task<string> GenerateOrderComment(string userQuestion, object orders)
    {
        var apiKey = _config["OpenAI:ApiKey"];

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        var prompt = $@"
Kullanıcının siparişleri aşağıdadır:

{JsonSerializer.Serialize(orders)}

Kullanıcı şunu sordu:
""{userQuestion}""

Siparişleri analiz et ve Türkçe, doğal, kısa ama açıklayıcı bir cevap ver.
Tamamlanan, bekleyen veya kargodaki siparişleri net şekilde belirt.
";

        var body = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = "Sen bir e-ticaret müşteri asistanısın." },
                new { role = "user", content = prompt }
            }
        };

        var response = await _httpClient.PostAsync(
            "https://api.openai.com/v1/chat/completions",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
        );

        if (!response.IsSuccessStatusCode)
            return "Siparişlerinizi inceledim, aşağıda detaylarını görebilirsiniz.";

        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()!;
    }
}
