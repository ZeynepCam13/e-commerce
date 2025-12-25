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

        // 🔥 ENUM - STRING EŞLEŞMESİ DÜZELDİ
        var body = m.NewStatus switch
        {
            "Pending"       => $"{m.OrderId} nolu siparişiniz alındı.",
            "Approved"      => $"{m.OrderId} nolu siparişiniz hazırlanıyor.",
            "PaymentFailed" => $"{m.OrderId} nolu siparişiniz kargoya verildi.",
            "Completed"     => $"{m.OrderId} nolu siparişiniz teslim edildi.",
            _               => $"{m.OrderId} nolu siparişinizin durumu güncellendi."
        };

        // 🔥 SENDGRID CONFIG DÜZELDİ
        var fromEmail = _configuration["SendGrid__FromEmail"];
        var apiKey    = _configuration["SendGrid__ApiKey"];

        if (string.IsNullOrEmpty(fromEmail) || string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine("❌ SendGrid ayarları eksik!");
            return;
        }

        var msg = new SendGridMessage
        {
            From = new EmailAddress(fromEmail, "E-Ticaret"),
            Subject = "Sipariş Durum Güncellemesi",
            PlainTextContent = body
        };

        msg.AddTo(m.Email);

        var result = await _sendGridClient.SendEmailAsync(msg);

        Console.WriteLine($"📨 Durum maili gönderildi → {m.Email}");
    }
}
