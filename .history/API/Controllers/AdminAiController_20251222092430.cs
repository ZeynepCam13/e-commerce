using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace API.Controllers;

[ApiController]
[Route("api/admin/ai")]
[Authorize(Roles = "Admin")]
public class AdminAiController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AdminAiController(IConfiguration config, HttpClient httpClient)
    {
        _config = config;
        _httpClient = httpClient;
    }

    [HttpPost("product-content")]
    public async Task<IActionResult> GenerateProductContent(
        [FromBody] AiProductContentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.marka))
        {
            return BadRequest("Eksik veri");
        }

        var apiKey = _config["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
            return BadRequest("OpenAI API key yok");

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        var prompt = $"""
You are an e-commerce SEO expert.

Product name: {dto.Name}
Brand: {dto.marka}

Write:
1. A persuasive Turkish product description (2–3 sentences)
2. SEO title (max 60 characters)
3. SEO meta description (max 160 characters)

Rules:
- Turkish only
- No emojis
- No markdown
- Return JSON ONLY in this format:

{{
  "description": "",
  "seoTitle": "",
  "seoDescription": ""
}}
""";

        var body = JsonSerializer.Serialize(new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = "You generate SEO optimized Turkish product content." },
                new { role = "user", content = prompt }
            },
            temperature = 0.7
        });

        var response = await _httpClient.PostAsync(
            "https://api.openai.com/v1/chat/completions",
            new StringContent(body, Encoding.UTF8, "application/json")
        );

        if (!response.IsSuccessStatusCode)
            return BadRequest("OpenAI isteği başarısız");

        var json = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);
        var content = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        if (string.IsNullOrWhiteSpace(content))
            return BadRequest("Boş AI cevabı");

        var result = JsonSerializer.Deserialize<object>(content);

        return Ok(result);
    }
}
