using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Entity
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        public string? Description { get; set; }

        

        [JsonIgnore]
        public ICollection<Product>? Products { get; set; }
        
        public ICollection<SubCategory> SubCategories { get; set; }

    }
}
