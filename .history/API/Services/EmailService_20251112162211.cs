using MailKit.Net.Smtp;
using MimeKit;

namespace API.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string toEmail, string otp);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config) => _config = config;

        public async Task SendVerificationEmailAsync(string toEmail, string otp)
        {
            var msg = new MimeMessage();
            msg.From.Add(new MailboxAddress("E-Ticaret", _config["EmailSettings:From"]));
            msg.To.Add(new MailboxAddress("", toEmail));
            msg.Subject = "E-posta Doğrulama Kodu";
            msg.Body = new TextPart("plain")
            {
                Text = $"Doğrulama kodunuz: {otp}\nBu kod 5 dakika geçerlidir."
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(_config["EmailSettings:SmtpServer"], 587, false);
            await client.AuthenticateAsync(_config["EmailSettings:From"], _config["EmailSettings:AppPassword"]);
            await client.SendAsync(msg);
            await client.DisconnectAsync(true);
        }
    }
}
