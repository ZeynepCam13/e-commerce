using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

public static class AiTextHelper
{
    public static async Task<string> GenerateAsync(string apiKey, string prompt)
    {
        using var http = new HttpClient();
        http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        var body = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = "Sen bir e-ticaret sitesinde çalışan samimi bir satış danışmanısın. Türkçe konuş." },
                new { role = "user", content = prompt }
            }
        };

        var res = await http.PostAsync(
            "https://api.openai.com/v1/chat/completions",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
        );

        var json = await res.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()!;
    }
}
