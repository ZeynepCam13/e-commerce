using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Messages; // API projesindeki mesaj modeline erişim
using SendGrid;
using SendGrid.Helpers.Mail;

var builder = Host.CreateApplicationBuilder(args);

// MassTransit + RabbitMQ ayarı
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<EmailConsumer>(); // Consumer ekle

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        // email-queue isimli kuyruğu dinle
        cfg.ReceiveEndpoint("email-queue", e =>
        {
            e.ConfigureConsumer<EmailConsumer>(context);
        });
         // INVOICE QUEUE  🔥
        cfg.ReceiveEndpoint("invoice-queue", e =>
        {
            e.ConfigureConsumer<InvoiceConsumer>(context);
        });
    });
});

// Consumer'ı kaydediyoruz
builder.Services.AddScoped<EmailConsumer>();

var host = builder.Build();
host.Run();


// -------------- CONSUMER SINIFI -------------------

public class EmailConsumer : MassTransit.IConsumer<EmailMessage>
{
    private readonly IConfiguration _config;

    public EmailConsumer(IConfiguration config)
    {
        _config = config;
    }

    public async Task Consume(MassTransit.ConsumeContext<EmailMessage> context)
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
            msg.Body);

        await client.SendEmailAsync(email);

        Console.WriteLine($"MAIL GÖNDERİLDİ → {msg.To}");
    }
}
