using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using EmailWorker.Consumers;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        // MassTransit Setup
        services.AddMassTransit(x =>
        {
            x.AddConsumer<EmailConsumer>();
            x.AddConsumer<InvoiceConsumer>();
            x.AddConsumer<OrderStatusChangedConsumer>();

            x.UsingRabbitMq((ctx, cfg) =>
            {
                cfg.Host("rabbitmq", "/", h =>
                {
                    h.Username("guest");
                    h.Password("guest");
                });


                cfg.ReceiveEndpoint("email-queue", e =>
                {
                    e.ConfigureConsumer<EmailConsumer>(ctx);
                });

                cfg.ReceiveEndpoint("invoice-queue", e =>
                {
                    e.ConfigureConsumer<InvoiceConsumer>(ctx);
                });

                cfg.ReceiveEndpoint("order-status-queue", e =>
                {
                    e.ConfigureConsumer<OrderStatusChangedConsumer>(ctx);
                });
            });
        });
    })
    .Build();

await host.RunAsync();
