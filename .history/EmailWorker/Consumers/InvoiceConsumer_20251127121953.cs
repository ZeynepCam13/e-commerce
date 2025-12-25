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

        Console.WriteLine($"📄 PDF hazırlanıyor OrderId={msg.OrderId}");

        // pdf oluştur
        byte[] pdfBytes = GenerateInvoicePdf(msg);
        Console.WriteLine($"PDF Boyutu: {pdfBytes.Length} bytes");

        // sendgrid
        var client = new SendGridClient(_config["SendGrid:ApiKey"]);
        var from = new EmailAddress(_config["SendGrid:FromEmail"], "E-Ticaret");
        var to = new EmailAddress(msg.Email);

        var email = MailHelper.CreateSingleEmail(
            from,
            to,
            "Sipariş Faturanız",
            "Faturanız ekte bulunmaktadır.",
            "Faturanız ekte bulunmaktadır."
        );

        // ekle
        email.AddAttachment(
            $"Fatura-{msg.OrderId}.pdf",
            Convert.ToBase64String(pdfBytes),
            "application/pdf"
        );

        await client.SendEmailAsync(email);

        Console.WriteLine($"📨 PDF Gönderildi → {msg.Email}");
    }


    private byte[] GenerateInvoicePdf(InvoiceMessage msg)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A5);
                page.Margin(40);

                page.Content().Column(col =>
                {
                    col.Item().Text("FATURA").FontSize(28).Bold();

                    col.Item().Text($"Sipariş No: {msg.OrderId}");
                    col.Item().Text($"Müşteri: {msg.FullName}");
                    col.Item().Text($"Adres: {msg.AddressLine}, {msg.City}");
                    col.Item().Text($"Tarih: {DateTime.Now:dd.MM.yyyy}");

                    col.Item().LineHorizontal(1).LineColor("#cccccc");

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(cols =>
                        {
                            cols.RelativeColumn();
                            cols.ConstantColumn(60);
                            cols.ConstantColumn(80);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Ürün");
                            header.Cell().Text("Adet");
                            header.Cell().Text("Fiyat");
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