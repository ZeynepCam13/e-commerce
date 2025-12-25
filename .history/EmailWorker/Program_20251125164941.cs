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


builder.Services.AddScoped<EmailConsumer>();
builder.Services.AddScoped<InvoiceConsumer>();

// Host oluştur ve çalıştır
var host = builder.Build();
host.Run();





