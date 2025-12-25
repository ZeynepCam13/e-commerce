using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entity;

public class Product
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
    public string? ImageUrl { get; set; }
    public int Stock { get; set; }

    public int? Discount { get; set; }

    public decimal? OriginalPrice { get; set; }
    public string? marka{get;set;}
    public ICollection<ProductColor> ProductColors { get; set; }

    public List<ProductSize> ProductSizes { get; set; } = new();


    [NotMapped]
    public decimal DiscountedPrice =>
        Discount.HasValue && Discount > 0
        ? Math.Round(Price * (1 - (Discount.Value / 100m)), 2)
        : Price;


    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    
    public int? subSubCategoryId { get; set; }
    
    [JsonIgnore]
    public SubSubCategory? subSubCategory { get; set; }



}