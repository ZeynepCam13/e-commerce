using API.Data;
using API.Dtos;
using API.Entity;
using API.Services;
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
    private readonly AiConversationMemory _memory;

    private static readonly Dictionary<string, string> KeywordToSubSubCategory = new()
    {
        { "elbise", "Elbise" },
        { "kazak", "Kazak" },
        { "tişört", "Tişört" },
        { "pantolon", "Pantolon" },
        { "gömlek", "Gömlek" },
        { "ayakkabı", "Ayakkabı" },
        { "spor ayakkabı", "Spor Ayakkabı" }
    };

    private static readonly string[] StopWords = { "ben", "bana", "bir", "istiyorum", "arıyorum", "lazım", "var", "mi", "mı", "mu", "mü" };
    private static readonly string[] ContinueWords = { "evet", "başka", "benzer", "devam", "olur", "olabilir" };

    public AiController(DataContext context, IConfiguration config, HttpClient httpClient, AiConversationMemory memory)
    {
        _context = context;
        _config = config;
        _httpClient = httpClient;
        _memory = memory;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest("Mesaj boş olamaz.");

        var apiKey = _config["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
            return BadRequest("OpenAI API key tanımlı değil.");

        var userKey = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "anon";
        var messageLower = dto.Message.ToLower();
        var cleanedMessage = messageLower;
        foreach (var w in StopWords) cleanedMessage = cleanedMessage.Replace(w, "");
        cleanedMessage = cleanedMessage.Trim();

        var isContinue = ContinueWords.Any(w => messageLower.Contains(w));
        string? matchedCategoryName = isContinue ? _memory.GetLastCategory(userKey) : null;

        if (string.IsNullOrEmpty(matchedCategoryName))
        {
            foreach (var kvp in KeywordToSubSubCategory)
            {
                if (messageLower.Contains(kvp.Key))
                {
                    matchedCategoryName = kvp.Value;
                    break;
                }
            }
        }

        int? matchedCategoryId = null;
        if (!string.IsNullOrEmpty(matchedCategoryName))
        {
            matchedCategoryId = await _context.SubSubCategories
                .Where(s => s.Name.ToLower().Contains(matchedCategoryName.ToLower()))
                .Select(s => (int?)s.Id)
                .FirstOrDefaultAsync();
        }

IQueryable<Product> q = _context.Products.Where(p => p.IsActive);

if (!string.IsNullOrEmpty(cleanedMessage))
{
    var search = cleanedMessage.ToLower();
    
    q = q.Where(p => 
        p.Name.ToLower().Contains(search) || 
        (p.Description != null && p.Description.ToLower().Contains(search))
    );
}


var products = await q
    .Take(5)
    .Select(p => new { p.Id, p.Name, p.Price })
    .ToListAsync();

if (!products.Any())
{
    products = await _context.Products
        .Where(p => p.IsActive)
        .OrderBy(r => Guid.NewGuid()) 
        .Take(5)
        .Select(p => new { p.Id, p.Name, p.Price })
        .ToListAsync();
}
        var productText = products.Any()
            ? string.Join("\n", products.Select((p, i) => $"{i + 1}. {p.Name} - {p.Price} TL Link: /catalog/{p.Id}"))
            : "Eşleşen ürün bulunamadı.";

  var systemPrompt = """
Sen profesyonel bir e-ticaret danışmanısın. 
GÖREVİN: Kullanıcıya ürün önerirken MUTLAKA her ürünün sonuna linkini eklemek.
KURAL 1: Link formatı sadece şu şekilde olmalıdır: /catalog/ID (Örn: /catalog/7004).
KURAL 2: Linki asla parantez içine alma, başına 'http' ekleme.
KURAL 3: Bir üründen bahsettiğin her cümleyi o ürünün linkiyle bitir.
Örnek Yanıt: "Bu çizgili kazak tam size göre! /catalog/7004"
""";
        var contextInfo = matchedCategoryName != null ? $"Context: User is browsing '{matchedCategoryName}'." : "No context.";
        
        var chatUserPrompt = $"""
        User message: "{dto.Message}"
        {contextInfo}
        Available products:
        {productText}
        """;

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        var body = JsonSerializer.Serialize(new {
            model = "gpt-4o-mini",
            messages = new[] {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = chatUserPrompt }
            }
        });

        var resp = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", 
            new StringContent(body, Encoding.UTF8, "application/json"));

        if (!resp.IsSuccessStatusCode) return BadRequest("OpenAI çağrısı başarısız.");

        using var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
        var reply = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

        return Ok(new AiChatResponseDto { Reply = reply ?? "" });
    }

    [HttpPost("similar-products")]
    public async Task<IActionResult> GetSimilarProducts([FromBody] AiSimilarProductsRequestDto dto)
    {
        var product = await _context.Products
            .Include(p => p.subSubCategory)
            .FirstOrDefaultAsync(p => p.Id == dto.ProductId && p.IsActive);

        if (product == null) return NotFound("Ürün bulunamadı");

        var candidates = await _context.Products
            .Where(p => p.IsActive && p.Id != product.Id && p.subSubCategoryId == product.subSubCategoryId)
            .Select(p => new {
                p.Id, p.Name, p.Description, p.Price,
                ImageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
            })
            .Take(4)
            .ToListAsync();

        return Ok(candidates);
    }
}