using SendGrid;
using SendGrid.Helpers.Mail;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string message);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string message)
    {
        var apiKey = _config["SendGrid:ApiKey"];
        var client = new SendGridClient(apiKey);

        var from = new EmailAddress(
            _config["SendGrid:FromEmail"],
            _config["SendGrid:FromName"]
        );

        var toEmail = new EmailAddress(to);

        var msg = MailHelper.CreateSingleEmail(from, toEmail, subject, message, null);

        await client.SendEmailAsync(msg);
    }
}
