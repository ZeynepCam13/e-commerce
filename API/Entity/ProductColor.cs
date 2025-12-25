using System.Text.Json.Serialization;

namespace API.Entity
{
    public class ProductColor
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        
        [JsonIgnore] 
        public Product Product { get; set; }

        public string ColorName { get; set; }   // Örn: Kırmızı
        public string ColorCode { get; set; }   // Örn: #FF0000


    }
}
