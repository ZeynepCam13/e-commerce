namespace Shared.Messages
{
    public class InvoiceMessage
    {
        public int OrderId { get; set; }
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string AddressLine { get; set; } = null!;
        public string City { get; set; } = null!;

        public List<InvoiceItem> Items { get; set; } = new();
        public decimal SubTotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal Total => SubTotal + DeliveryFee;
    }

}
