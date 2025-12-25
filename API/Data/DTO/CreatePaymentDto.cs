namespace API.Dtos
{
    public class CreatePaymentDto
    {
        public decimal Price { get; set; }
        public string Email { get; set; }
        public string CallbackUrl { get; set; }
    }
}
