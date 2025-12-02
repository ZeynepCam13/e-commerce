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

        Console.WriteLine($"📄 Fatura hazırlanıyor... OrderId: {msg.OrderId}");

        // 1) PDF oluştur
        byte[] pdfBytes = GenerateInvoicePdf(msg);

        // 2) Mail gönder
        var client = new SendGridClient(_config["SendGrid:ApiKey"]);
        var from = new EmailAddress(_config["SendGrid:FromEmail"], "E-Ticaret");
        var to = new EmailAddress(msg.Email);

        var email = MailHelper.CreateSingleEmail(from, to,
            "Sipariş Faturanız",
            "Faturanızı ekte bulabilirsiniz.",
            "Faturanızı ekte bulabilirsiniz.");

        // PDF’i ekle
        email.AddAttachment(
            $"Fatura-{msg.OrderId}.pdf",
            Convert.ToBase64String(pdfBytes),
            "application/pdf"
        );

        await client.SendEmailAsync(email);

        Console.WriteLine($"📨 Fatura PDF gönderildi → {msg.Email}");
    }


    // 📌 PDF Üretme Metodu
    private byte[] GenerateInvoicePdf(InvoiceMessage msg)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.PageColor("#FFFFFF");

                page.Content().Column(col =>
                {
                    col.Item().Text("FATURA")
                        .FontSize(28).Bold().FontColor("#2B2B2B");

                    col.Item().Text($"Sipariş No: {msg.OrderId}");
                    col.Item().Text($"Müşteri: {msg.FullName}");
                    col.Item().Text($"Adres: {msg.AddressLine} - {msg.City}");
                    col.Item().Text($"Tarih: {DateTime.Now:dd.MM.yyyy}");

                    col.Item().LineHorizontal(1).LineColor("#ccc");

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(cols =>
                        {
                            cols.ConstantColumn(200);
                            cols.RelativeColumn();
                            cols.RelativeColumn();
                        });

                        // başlık
                        table.Header(header =>
                        {
                            header.Cell().Text("Ürün");
                            header.Cell().Text("Adet");
                            header.Cell().Text("Fiyat");
                        });

                        // ürünler
                        foreach (var item in msg.Items)
                        {
                            table.Cell().Text(item.ProductName);
                            table.Cell().Text(item.Quantity.ToString());
                            table.Cell().Text($"{item.Price} TL");
                        }
                    });

                    col.Item().AlignRight().Text($"Ara Toplam: {msg.SubTotal} TL");
                    col.Item().AlignRight().Text($"Kargo: {msg.DeliveryFee} TL");
                    col.Item().AlignRight().Text($"Toplam: {msg.Total} TL").Bold();
                });
            });
        });

        return document.GeneratePdf();
    }
}

