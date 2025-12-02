namespace Shared.Messages
{
    public class InvoiceItem
    {
        public string ProductName { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
