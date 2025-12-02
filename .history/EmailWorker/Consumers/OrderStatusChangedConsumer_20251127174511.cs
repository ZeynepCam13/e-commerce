public class OrderStatusChangedConsumer : IConsumer<OrderStatusChangedMessage>
{
    private readonly IEmailService _emailService;

    public OrderStatusChangedConsumer(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task Consume(ConsumeContext<OrderStatusChangedMessage> context)
    {
        var m = context.Message;

        string body = m.NewStatus switch
        {
            "Preparing" =>
                $"{m.OrderId} numaralı siparişiniz hazırlanıyor. En geç 3 iş günü içerisinde kargoya verilecektir.",
            "Shipped" =>
                $"{m.OrderId} numaralı siparişiniz kargoya verilmiştir. En kısa sürede size ulaşacaktır.",
            "Delivered" =>
                $"{m.OrderId} numaralı siparişiniz teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.",
            _ =>
                $"{m.OrderId} numaralı siparişinizin durumu güncellenmiştir."
        };

        await _emailService.SendEmailAsync(m.Email, "Sipariş Durum Güncellemesi", body);
    }
}
