namespace API.Dtos
{
    public class ProductCreateDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Description { get; set; }
         public int SubSubCategoryId { get; set; }

        // Çoklu resim
        public List<IFormFile>? Images { get; set; }
        public List<ProductSizeDto>? Sizes { get; set;}
        public List<ProductColorDto>? Colors { get; set; }
        public List<int> ColorIds { get; set; } = new();


    }
}
