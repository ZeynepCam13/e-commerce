using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Messages;
using SendGrid;
using SendGrid.Helpers.Mail;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

QuestPDF.Settings.License = LicenseType.Community;

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);


builder.Services.AddScoped<EmailConsumer>();
builder.Services.AddScoped<InvoiceConsumer>();


builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<EmailConsumer>();
    x.AddConsumer<InvoiceConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("rabbitmq", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        cfg.ReceiveEndpoint("email-queue", e =>
        {
            e.ConfigureConsumer<EmailConsumer>(context);
        });

        cfg.ReceiveEndpoint("invoice-queue", e =>
        {
            e.ConfigureConsumer<InvoiceConsumer>(context);
        });
    });
});

var host = builder.Build();
host.Run();
