using API.Entity;

public class ProductEmbedding
{
    public int ProductId{get;set;}
    public string Model{get; set;}="text-embedding-3-small";
    public int Dimensions{get;set;}=1536;

      // JSON olarak saklayacağız (ilk aşama için ideal)
    public string Vector { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Product Product { get; set; }

}