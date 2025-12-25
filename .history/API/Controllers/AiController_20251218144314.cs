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

        // 1️⃣ Ürünleri veritabanından çek
        var products = await _context.Products
            .Where(p =>
                p.IsActive &&
                (
                    p.Name.ToLower().Contains(dto.Message.ToLower()) ||
                    (p.Description != null &&
                     p.Description.ToLower().Contains(dto.Message.ToLower()))
                )
            )
            .Take(5)
            .Select(p => new
            {
                p.Name,
                p.Price,
                p.Description
            })
            .ToListAsync();

        // 2️⃣ Ürünleri AI için metne çevir
        var productText = products.Any()
            ? string.Join("\n", products.Select((p, i) =>
                $"{i + 1}. {p.Name} - {p.Price} TL - {p.Description}"
              ))
            : "No matching products found.";

        // 3️⃣ AI prompt
        var systemPrompt = """
You are an e-commerce product recommendation assistant.
You only recommend products provided to you.
Do not invent products.
If no products are provided, say:
"Maalesef aradığınız kritere uygun ürün bulunamadı."
Speak Turkish.
""";

        var userPrompt = $"""
User request:
"{dto.Message}"

Available products:
{productText}
""";

        // 4️⃣ OpenAI isteği
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
