using SendGrid;
using SendGrid.Helpers.Mail;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string message);
}

public class EmailService : IEmailService
{
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public EmailService(IConfiguration config)
    {
        _apiKey = config["SendGrid:ApiKey"];
        _fromEmail = config["SendGrid:FromEmail"];
        _fromName = config["SendGrid:FromName"];
    }

    public async Task SendEmailAsync(string to, string subject, string message)
    {
        var client = new SendGridClient(_apiKey);

        var from = new EmailAddress(_fromEmail, _fromName);
        var toEmail = new EmailAddress(to);

        var msg = MailHelper.CreateSingleEmail(from, toEmail, subject, message, message);

        var response = await client.SendEmailAsync(msg);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Email gönderilemedi → " + response.StatusCode);
        }
    }
}
