namespace API.Entity
{
    public class ProductColor
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public string ColorName { get; set; }   // Örn: Kırmızı
        public string ColorCode { get; set; }   // Örn: #FF0000

        public int Stock { get; set; }
    }
}
