using MassTransit;
using Shared.Messages;
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;

namespace EmailWorker.Consumers
{
    public class OrderStatusChangedConsumer : IConsumer<OrderStatusChangedMessage>
    {
        private readonly IConfiguration _config;

        public OrderStatusChangedConsumer(IConfiguration config)
        {
            _config = config;
        }

        public async Task Consume(ConsumeContext<OrderStatusChangedMessage> context)
        {
            var m = context.Message;

            // HTML mesaj (controller’dan geliyor)
            var body = m.Message;

            // SendGrid ayarları
            var apiKey = _config["SendGrid:ApiKey"];
            var fromEmail = _config["SendGrid:FromEmail"];

            var client = new SendGridClient(apiKey);

            var msg = new SendGridMessage
            {
                From = new EmailAddress(fromEmail, "E-Ticaret"),
                Subject = $"Sipariş Durumu: {m.NewStatus}",
                HtmlContent = body
            };

            msg.AddTo(m.Email);

            await client.SendEmailAsync(msg);

            Console.WriteLine($"📨 Sipariş durumu maili gönderildi → {m.Email}");
        }
    }
}
