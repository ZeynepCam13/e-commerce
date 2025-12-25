using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Messages;
using SendGrid;
using SendGrid.Helpers.Mail;

var builder = Host.CreateApplicationBuilder(args);

// MassTransit Konfigürasyonu
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<EmailConsumer>();
    x.AddConsumer<InvoiceConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        // Email Kuyruğu
        cfg.ReceiveEndpoint("email-queue", e =>
        {
            e.ConfigureConsumer<EmailConsumer>(context);
        });

        // Invoice Kuyruğu
        cfg.ReceiveEndpoint("invoice-queue", e =>
        {
            e.ConfigureConsumer<InvoiceConsumer>(context);
        });
    });
});

// Host oluştur ve çalıştır
var host = builder.Build();
host.Run();


// ------------------ EMAIL CONSUMER ------------------

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

        var email = MailHelper.CreateSingleEmail(
            from,
            to,
            msg.Subject,
            msg.Body,
            msg.Body
        );

        await client.SendEmailAsync(email);

        Console.WriteLine($"📧 Email gönderildi → {msg.To}");
    }
}


// ------------------ INVOICE CONSUMER ------------------

public class InvoiceConsumer : IConsumer<InvoiceMessage>
{
    private readonly IConfiguration _config;

    public InvoiceConsumer(IConfiguration config)
    {
        _config = config;
    }

    public async Task Consume(ConsumeContext<InvoiceMessage> context)
    {
        var msg = context.Message;

        // Burada faturayı PDF üretip göndereceğiz
        Console.WriteLine($"📄 Fatura kuyruğa düştü → OrderId: {msg.OrderId}");

        // Şimdilik sadece log atalım
    }
}
