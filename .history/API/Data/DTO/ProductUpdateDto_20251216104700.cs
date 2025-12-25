using API.Dtos;

public class ProductUpdateDto
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Description { get; set; }
     public int SubSubCategoryId { get; set; }
    

    public List<ProductSizeDto>? Sizes { get; set; }

    public List<ProductColorDto>? Colors { get; set; }

}
