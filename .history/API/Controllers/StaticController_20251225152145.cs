using Microsoft.AspNetCore.Mvc;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaticController : ControllerBase
    {
        private readonly YourDbContext _context;

        public StaticController(YourDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStoreStats()
{
    // 1. Toplam Kazanç ve Sipariş Sayısı
    var totalSales = await _context.Orders.SumAsync(o => o.TotalAmount);
    var totalOrders = await _context.Orders.CountAsync();
    
    // 2. Yeni Müşteriler (Son 30 günde kayıt olan veya sipariş veren tekil kullanıcılar)
    var newCustomers = await _context.Orders
        .Where(o => o.OrderDate >= DateTime.Now.AddDays(-30))
        .Select(o => o.CustomerEmail) // veya CustomerId
        .Distinct()
        .CountAsync();

    // 3. Grafik İçin: Son 30 Günün Satış Trendi
    var thirtyDaysAgo = DateTime.Now.AddDays(-30);
    var salesTrend = await _context.Orders
        .Where(o => o.OrderDate >= thirtyDaysAgo)
        .GroupBy(o => o.OrderDate.Date)
        .Select(g => new { 
            date = g.Key.ToString("dd.MM"), 
            amount = g.Sum(o => o.TotalAmount) 
        })
        .OrderBy(x => x.date)
        .ToListAsync();

    // 4. Kategori Bazlı Dağılım
    // Not: Ürünlerinizin kategori bilgisinin OrderItems içinde veya Product tablosuyla ilişkili olduğunu varsayıyorum
    var categoryStats = await _context.OrderItems
        .GroupBy(oi => oi.CategoryName ?? "Belirtilmemiş") // CategoryName kolonunuz varsa
        .Select(g => new { 
            name = g.Key, 
            value = g.Count() 
        })
        .ToListAsync();

    return Ok(new { 
        totalSales, 
        totalOrders, 
        newCustomers, 
        salesTrend, 
        categoryStats 
    });
    }
}