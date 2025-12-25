using API.Data;
using API.Dtos;
using API.Entity;
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

    // 🔹 Anahtar kelime → SubSubCategory eşlemesi
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

    // 🔹 Stop words (önemsiz kelimeler)
    private static readonly string[] StopWords =
    {
        "ben", "bana", "bir", "istiyorum", "arıyorum",
        "lazım", "var", "mi", "mı", "mu", "mü",
        "acaba", "şöyle", "böyle"
    };

    public AiController(
        DataContext context,
        IConfiguration config,
        HttpClient httpClient)
    {
        _context = context;
        _config = config;
        _httpClient = httpClient;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest("Mesaj boş olamaz.");

        var apiKey = _config["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
            return BadRequest("OpenAI API key tanımlı değil.");

        // 1️⃣ Mesajı normalize et
        var messageLower = dto.Message.ToLower();

        var cleanedMessage = messageLower;
        foreach (var word in StopWords)
        {
            cleanedMessage = cleanedMessage.Replace(word, "");
        }
        cleanedMessage = cleanedMessage.Trim();

        // 2️⃣ Kategori anahtar kelime tespiti
        string? matchedSubSubCategoryName = null;

        foreach (var kvp in KeywordToSubSubCategory)
        {
            if (messageLower.Contains(kvp.Key))
            {
                matchedSubSubCategoryName = kvp.Value;
                break;
            }
        }

        // 3️⃣ SubSubCategory ID bul (NAVIGATION YOK)
        int? matchedSubSubCategoryId = null;

        if (!string.IsNullOrEmpty(matchedSubSubCategoryName))
        {
            matchedSubSubCategoryId = await _context.SubSubCategories
                .Where(s => s.Name.ToLower().Contains(matchedSubSubCategoryName.ToLower()))
                .Select(s => (int?)s.Id)
                .FirstOrDefaultAsync();
        }

        // 4️⃣ Ürün sorgusu (ID bazlı)
        IQueryable<Product> productsQuery = _context.Products
            .Where(p => p.IsActive);

        if (matchedSubSubCategoryId.HasValue)
        {
            // ✅ KATEGORİ ÖNCELİKLİ (KESİN ÇALIŞIR)
            productsQuery = productsQuery.Where(p =>
                p.subSubCategoryId == matchedSubSubCategoryId.Value
            );
        }
        else if (!string.IsNullOrEmpty(cleanedMessage))
        {
            // 🔁 FALLBACK: string arama
            productsQuery = productsQuery.Where(p =>
                p.Name.ToLower().Contains(cleanedMessage) ||
                (p.Description != null &&
                 p.Description.ToLower().Contains(cleanedMessage))
            );
        }

        var products = await productsQuery
            .Take(5)
            .Select(p => new
            {
                p.Name,
                p.Price,
                p.Description
            })
            .ToListAsync();

        // 5️⃣ AI için ürün metni
        var productText = products.Any()
            ? string.Join("\n", products.Select((p, i) =>
                $"{i + 1}. {p.Name} - {p.Price} TL - {p.Description}"
              ))
            : "No matching products found.";

        // 6️⃣ AI prompt
        var systemPrompt = """
You are an e-commerce product recommendation assistant.
You only recommend products provided to you.
Do not invent products.
If no products are provided, say:
"Maalesef aradığınız kritere uygun ürün bulunamadı."
Speak Turkish.
""";

        var categoryInfo = matchedSubSubCategoryName != null
            ? $"Detected category: {matchedSubSubCategoryName}"
            : "No specific category detected.";

        var userPrompt = $"""
User request:
"{dto.Message}"

{categoryInfo}

Available products:
{productText}
""";

        // 7️⃣ OpenAI isteği
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        var requestBody = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(
            "https://api.openai.com/v1/chat/completions",
            content
        );

        if (!response.IsSuccessStatusCode)
            return BadRequest("OpenAI çağrısı başarısız.");

        var responseJson = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseJson);

        var reply = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return Ok(new AiChatResponseDto
        {
            Reply = reply ?? ""
        });
    }
}
