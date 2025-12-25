namespace API.Services.Abstractions;

public interface IEmbeddingService
{
    Task<float[]> CreateEmbeddingAsync(string text);
}
