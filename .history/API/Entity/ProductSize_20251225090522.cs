using System.Text.Json.Serialization;

namespace API.Entity
{
    public class ProductSize
    {
        public int Id { get; set; }
       
        public int ProductId { get; set; }
       
        public string Size { get; set; }

        public int Stock { get; set; }

        [JsonIgnore]
        public Product Product { get; set; }
    }
}
