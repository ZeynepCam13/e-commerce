using System.Text.Json.Serialization;
using API.Entity;

namespace API.Entity
{

    public class ProductImage
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }
        
        [JsonIgnore]
        public Product product { get; set; }
    }
}