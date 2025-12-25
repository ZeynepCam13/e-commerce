using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class SubSubCategory
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [JsonIgnore]
    public int SubCategoryId { get; set; }
    
    [JsonIgnore]
    public SubCategory SubCategory { get; set; }
}
