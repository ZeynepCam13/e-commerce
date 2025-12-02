using MassTransit;
using Shared.Messages;
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;

namespace EmailWorker.Consumers
{
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

            // 🔥 Artık controller'dan gelen HTML mesajı direkt kullanıyoruz
            var body = m.Message;

            // SendGrid config
            var fromEmail = _configuration["SendGrid__FromEmail"];

            var msg = new SendGridMessage
            {
                From = new EmailAddress(fromEmail, "E-Ticaret"),
                Subject = $"Sipariş Durumu: {m.NewStatus}",
                HtmlContent = body // 🔥 HTML İÇERİK BURADA!
            };

            msg.AddTo(m.Email);

            var result = await _sendGridClient.SendEmailAsync(msg);

            Console.WriteLine($"📨 HTML durum maili gönderildi → {m.Email}");
        }
    }
}
