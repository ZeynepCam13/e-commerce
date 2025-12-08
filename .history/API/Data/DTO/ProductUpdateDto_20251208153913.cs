using API.Dtos;

public class ProductUpdateDto
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Description { get; set; }
    public int? CategoryId { get; set; }

    public List<ProductSizeDto>? Sizes { get; set; }
}
