using MassTransit;
using SendGrid;
using SendGrid.Helpers.Mail;
using Shared.Messages;

public class EmailConsumer : IConsumer<EmailMessage>
{
    private readonly IConfiguration _config;

    public EmailConsumer(IConfiguration config)
    {
        _config = config;
    }

    public async Task Consume(ConsumeContext<EmailMessage> context)
    {
        var msg = context.Message;

        var client = new SendGridClient(_config["SendGrid:ApiKey"]);
        var from = new EmailAddress(_config["SendGrid:FromEmail"], "E-Ticaret");
        var to = new EmailAddress(msg.To);

        var email = MailHelper.CreateSingleEmail(from, to, msg.Subject, msg.Body, msg.Body);

        await client.SendEmailAsync(email);
        Console.WriteLine($"📧 Email gönderildi → {msg.To}");
    }
}
