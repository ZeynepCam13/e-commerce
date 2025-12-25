using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using API.Options;
using API.Services.Abstractions;
using Microsoft.Extensions.Options;

namespace API.Services.OpenAI;

public class OpenAiEmbeddingService : IEmbeddingService
{
    private readonly HttpClient _httpClient;
    private readonly OpenAIOptions _options;

    public OpenAiEmbeddingService(
        HttpClient httpClient,
        IOptions<OpenAIOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<float[]> CreateEmbeddingAsync(string text)
    {
        var requestBody = new
        {
            model = _options.EmbeddingModel,
            input = text
        };

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.openai.com/v1/embeddings");

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", _options.ApiKey);

        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json");

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        using var stream = await response.Content.ReadAsStreamAsync();
        using var doc = await JsonDocument.ParseAsync(stream);

        var embedding = doc
            .RootElement
            .GetProperty("data")[0]
            .GetProperty("embedding")
            .EnumerateArray()
            .Select(x => x.GetSingle())
            .ToArray();

        return embedding;
    }
}
