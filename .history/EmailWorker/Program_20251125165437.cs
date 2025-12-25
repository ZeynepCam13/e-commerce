using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Messages;
using SendGrid;
using SendGrid.Helpers.Mail;

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

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





