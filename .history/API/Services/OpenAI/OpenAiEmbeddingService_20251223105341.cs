using API.Services.Abstractions;

namespace API.Services.OpenAI;

public class OpenAiEmbeddingService : IEmbeddingService
{
    public async Task<float[]> CreateEmbeddingAsync(string text)
    {
        // OpenAI embeddings çağrısı burada olacak
        throw new NotImplementedException();
    }
}
