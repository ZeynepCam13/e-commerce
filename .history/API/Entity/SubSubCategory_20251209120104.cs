using System.ComponentModel.DataAnnotations;

public class SubSubCategory
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public int SubCategoryId { get; set; }
    public SubCategory SubCategory { get; set; }
}
