using MassTransit;
using SendGrid;
using SendGrid.Helpers.Mail;
using Shared.Messages;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

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

        byte[] pdfBytes = GenerateInvoicePdf(msg);

        var client = new SendGridClient(_config["SendGrid:ApiKey"]);
        var from = new EmailAddress(_config["SendGrid:FromEmail"], "E-Ticaret");
        var to = new EmailAddress(msg.Email);

        var email = MailHelper.CreateSingleEmail(
            from,
            to,
            "Sipariş Faturanız",
            "Faturanızı ekte bulabilirsiniz.",
            "Faturanızı ekte bulabilirsiniz."
        );

        email.AddAttachment($"Fatura-{msg.OrderId}.pdf",
            Convert.ToBase64String(pdfBytes),
            "application/pdf");

        await client.SendEmailAsync(email);

        Console.WriteLine($"📨 Fatura PDF gönderildi → {msg.Email}");
    }

    private byte[] GenerateInvoicePdf(InvoiceMessage msg)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(40);
                page.Content().Column(col =>
                {
                    col.Item().Text("FATURA").FontSize(24).Bold();

                    col.Item().Text($"Sipariş No: {msg.OrderId}");
                    col.Item().Text($"Müşteri: {msg.FullName}");
                    col.Item().Text($"Adres: {msg.AddressLine} - {msg.City}");
                    col.Item().Text($"Tarih: {DateTime.Now:dd.MM.yyyy}");

                    col.Item().LineHorizontal(1);

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn();
                            c.ConstantColumn(50);
                            c.ConstantColumn(80);
                        });

                        table.Header(h =>
                        {
                            h.Cell().Text("Ürün");
                            h.Cell().Text("Adet");
                            h.Cell().Text("Fiyat");
                        });

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
