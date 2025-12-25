using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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


    [NotMapped]
    public decimal DiscountedPrice =>
        Discount.HasValue && Discount > 0
        ? Math.Round(Price * (1 - (Discount.Value / 100m)), 2)
        : Price;


    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public int? CategoryId { get; set; }  
    public Category? Category { get; set; }  

    public string Color{get;set;}
    public string Sizes{get;set;}

}