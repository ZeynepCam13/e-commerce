using System.Text.Json.Serialization;

namespace API.Entity
{
    public class ProductSize
    {
        public int Id { get; set; }

        // Hangi ürüne ait?
        public int ProductId { get; set; }

        // Beden bilgisi (S, M, L, XL...)
        public string Size { get; set; }

        // Bu bedenin stoğu
        public int Stock { get; set; }

        // Navigation property
        [JsonIgnore]
        public Product Product { get; set; }
    }
}
