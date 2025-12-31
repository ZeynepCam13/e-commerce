using API.AI;
using API.Data;
using API.Dtos;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly DataContext _context;

    public AiController(DataContext context)
    {
        _context = context;
    }

    private static readonly Dictionary<string, string> CategoryMap = new()
    {
        { "kazak", "Kazak" },
        { "pantolon", "Pantolon" },
        { "gömlek", "Gömlek" },
        { "tişört", "Tişört" },
        { "elbise", "Elbise" }
    };

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequestDto dto)
    {
        var text = dto.Message.ToLower();
        var intent = AiIntentDetector.Detect(text);
var introMessage = AiResponseBuilder.BuildIntro(intent);

        /* ===========================
           🔐 AUTH KONTROL
        =========================== */
        var userId = User.Identity?.Name;
        var isAuth = User.Identity?.IsAuthenticated ?? false;

        /* ===========================
           📦 SİPARİŞLER
        =========================== */
        if (text.Contains("sipariş"))
        {
            if (!isAuth)
                return Ok(new { type = "text", message = "Siparişlerinizi görüntüleyebilmem için giriş yapmanız gerekiyor." });

            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    id = o.Id,
                    status = o.OrderStatus.ToString(),
                    total = o.GetTotal(),
                    date = o.OrderDate
                })
                .ToListAsync();

            if (!orders.Any())
            {
                return Ok(new
                {
                    type = "text",
                    message = "Henüz hiç siparişiniz bulunmuyor."
                });
            }

            /* 🔍 TAMAMLANAN SİPARİŞ SORUSU */
            if (text.Contains("tamamlandı") || text.Contains("completed"))
            {
                var completed = orders.Where(o => o.status == "Completed").ToList();

                if (!completed.Any())
                {
                    return Ok(new
                    {
                        type = "text",
                        message = "Şu ana kadar tamamlanan bir siparişiniz bulunmuyor."
                    });
                }

                return Ok(new
                {
                    type = "orders",
                    message = introMessage,
                    orders=orders
                });
            }

            /* 🔍 EN SON SİPARİŞ */
            if (text.Contains("son"))
            {
                var last = orders.First();

                return Ok(new
                {
                    type = "text",
                    message =
                        $"En son siparişiniz #{last.id}. " +
                        $"Durumu: {last.status}. " +
                        $"Toplam tutar: {last.total} TL."
                });
            }

            /* 📋 GENEL LİSTE */
            return Ok(new
            {
                type = "orders",
                message = "Siparişlerinizin genel durumu aşağıdadır:",
                orders
            });
        }

        /* ===========================
           🛍️ ÜRÜN ARAMA
        =========================== */
        foreach (var key in CategoryMap.Keys)
        {
            if (text.Contains(key))
            {
                var category = CategoryMap[key];

                var products = await _context.Products
                    .Include(p => p.Images)
                    .Include(p => p.subSubCategory)
                    .Where(p =>
                        p.IsActive &&
                        (p.subSubCategory.Name == category || p.Name.ToLower().Contains(key))
                    )
                    .Take(6)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        price = p.Price,
                        imageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
                    })
                    .ToListAsync();

                return Ok(new
                {
                    type = "products",
                    message = products.Any()
                        ? $"{category} kategorisinde sizin için seçtiğim ürünler:"
                        : "Bu kategori için uygun ürün bulamadım.",
                    products
                });
            }
        }

        /* ===========================
           👗 KOMBİN
        =========================== */
        // 🔹 KOMBİN / ÜSTÜNE NE GİYİLİR
if (text.Contains("üstüne") || text.Contains("kombin"))
{
    string yorum = "Bu parça ile uyumlu olabilecek üst giyim ürünlerini senin için seçtim.";

    if (text.Contains("siyah"))
    {
        yorum =
            "Siyah alt parçalar oldukça zamansız ve kurtarıcıdır. " +
            "Kontrast yaratmak için açık tonlarda kazaklar tercih edebilir, " +
            "daha sade bir görünüm için ise düz ve minimal modellerle kombinleyebilirsin.";
    }
    else if (text.Contains("beyaz"))
    {
        yorum =
            "Beyaz alt parçalar ferah bir görünüm sağlar. " +
            "Canlı renkli veya dokulu kazaklarla kombini hareketlendirmek iyi bir tercih olabilir.";
    }
    else if (text.Contains("jean") || text.Contains("kot"))
    {
        yorum =
            "Jean pantolonlar günlük kombinler için idealdir. " +
            "Rahat kesimli kazaklar veya basic üstlerle oldukça şık durur.";
    }

    var products = await _context.Products
        .Include(p => p.Images)
        .Where(p =>
            p.IsActive &&
            (p.subSubCategory.Name == "Kazak" ||
             p.subSubCategory.Name == "Gömlek" ||
             p.subSubCategory.Name == "Tişört"))
        .OrderBy(_ => Guid.NewGuid())
        .Take(4)
        .Select(p => new
        {
            id = p.Id,
            name = p.Name,
            price = p.Price,
            imageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault() ?? p.ImageUrl
        })
        .ToListAsync();

    return Ok(new
    {
        type = "products",
        message = yorum,
        products
    });
}


        /* ===========================
           🤖 FALLBACK
        =========================== */
        return Ok(new
        {
            type = "text",
            message =
                "Size ürün önerebilirim, kombin yapabilirim veya siparişlerinizin durumunu yorumlayabilirim. " +
                "Örneğin: 'hangi siparişim tamamlandı?'"
        });
    }
}
