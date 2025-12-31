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
        return BadRequest("Mesaj boş");

    var search = dto.Message.ToLower().Trim();

  
    var products = await _context.Products
        .Where(p => p.IsActive)
        .Where(p =>
            p.Name.ToLower().Contains(search) ||
            (p.Description != null && p.Description.ToLower().Contains(search)) ||
            p.subSubCategory.Name.ToLower().Contains(search)
        )
        .Include(p => p.Images)
        .Take(5)
        .Select(p => new
        {
            p.Id,
            p.Name,
            p.Price,
            ImageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
        })
        .ToListAsync();


    if (!products.Any())
    {
        products = await _context.Products
            .Where(p => p.IsActive)
            .Include(p => p.Images)
            .OrderBy(x => Guid.NewGuid())
            .Take(5)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                ImageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
            })
            .ToListAsync();
    }
    var productText = string.Join("\n",
        products.Select(p =>
            $"{p.Name} - {p.Price} TL\n/catalog/{p.Id}"
        )
    );

    var apiKey = _config["OpenAI:ApiKey"];
    _httpClient.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", apiKey);

    var body = JsonSerializer.Serialize(new
    {
        model = "gpt-4o-mini",
        messages = new[]
        {
            new { role = "system", content = "Bir e-ticaret satış asistanısın." },
            new { role = "user", content = $"Kullanıcı: {dto.Message}\nÜrünler:\n{productText}" }
        }
    });

    var resp = await _httpClient.PostAsync(
        "https://api.openai.com/v1/chat/completions",
        new StringContent(body, Encoding.UTF8, "application/json")
    );

    if (!resp.IsSuccessStatusCode)
        return Ok(new { reply = "Ürünleri senin için listeliyorum 👇", products });

    using var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
    var reply = doc.RootElement
        .GetProperty("choices")[0]
        .GetProperty("message")
        .GetProperty("content")
        .GetString();

    return Ok(new
    {
        reply,
        products
    });
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