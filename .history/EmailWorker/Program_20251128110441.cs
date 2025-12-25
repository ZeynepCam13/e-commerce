using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Messages;
using EmailWorker.Consumers;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        // MassTransit yapılandırması
        services.AddMassTransit(x =>
        {
            x.AddConsumer<EmailConsumer>();
            x.AddConsumer<InvoiceConsumer>();
            x.AddConsumer<OrderStatusChangedConsumer>();

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

                cfg.ReceiveEndpoint("order-status-queue", e =>
                {
                    e.ConfigureConsumer<OrderStatusChangedConsumer>(context);
                });
            });
        });

        services.AddHostedService<Worker>();
    })
    .Build();

await host.RunAsync();
