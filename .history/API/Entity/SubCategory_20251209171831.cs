using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using API.Entity;



namespace API.Entity{
  public class SubCategory
  {
    [Key]
    public int Id{get;set;}
    [Required]
    public string Name{get;set;}
     public int CategoryId { get; set; }
     
     [JsonIgnore]
    public Category Category { get; set; }

    public ICollection<SubSubCategory>? SubSubCategories { get; set; }

  }
}