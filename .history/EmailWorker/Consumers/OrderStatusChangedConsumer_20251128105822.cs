using MassTransit;
using Shared.Messages;
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;

namespace EmailWorker.Consumers;

public class OrderStatusChangedConsumer : IConsumer<OrderStatusChangedMessage>
{
    private readonly ISendGridClient _sendGridClient;
    private readonly IConfiguration _configuration;

    public OrderStatusChangedConsumer(ISendGridClient sendGridClient, IConfiguration configuration)
    {
        _sendGridClient = sendGridClient;
        _configuration = configuration;
    }

    public async Task Consume(ConsumeContext<OrderStatusChangedMessage> context)
    {
        var m = context.Message;

        // Gönderilecek mail metni
        var body = m.NewStatus switch
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

        var fromEmail = _configuration["SendGrid:From"] ?? "no-reply@ecommerce.com";
        var fromName  = _configuration["SendGrid:FromName"] ?? "E-Commerce";

        var msg = new SendGridMessage
        {
            From = new EmailAddress(fromEmail, fromName),
            Subject = "Sipariş Durum Güncellemesi",
            PlainTextContent = body
        };

        msg.AddTo(m.Email);

        await _sendGridClient.SendEmailAsync(msg);
    }
}
