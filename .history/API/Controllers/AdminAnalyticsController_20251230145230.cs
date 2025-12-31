using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin/analytics")]
public class AdminAnalyticsController : ControllerBase
{
    private readonly DataContext _context;

    public AdminAnalyticsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalProducts = await _context.Products.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();

        var totalRevenue = await _context.Orders
    .Where(o => o.OrderStatus == OrderStatus.Completed)
    .SumAsync(o => (decimal?)(o.SubTotal + o.DeliveryFree)) ?? 0;


        return Ok(new
        {
            totalProducts,
            totalOrders,
            totalRevenue
        });
    }
    [HttpGet("monthly-revenue")]
public async Task<IActionResult> GetMonthlyRevenue()
{
    var data = await _context.Orders
        .Where(o => o.OrderStatus == OrderStatus.Completed)
        .GroupBy(o => new
        {
            o.OrderDate.Year,
            o.OrderDate.Month
        })
        .Select(g => new
        {
            year = g.Key.Year,
            month = g.Key.Month,
            totalRevenue = g.Sum(o => o.SubTotal + o.DeliveryFree)
        })
        .OrderBy(x => x.year)
        .ThenBy(x => x.month)
        .ToListAsync();

    return Ok(data);
}

[HttpGet("top-products")]
public async Task<IActionResult> GetTopProducts()
{
    var result = await _context.Orders
        .Where(o => o.OrderStatus == OrderStatus.Completed)
        .SelectMany(o => o.OrderItems)
        .GroupBy(oi => new
        {
            oi.ProductId,
            oi.ProductName
        })
        .Select(g => new
        {
            productId = g.Key.ProductId,
            productName = g.Key.ProductName,
            totalSold = g.Sum(x => x.Quantity),
            totalRevenue = g.Sum(x => x.Quantity * x.Price)
        })
        .OrderByDescending(x => x.totalSold)
        .Take(5)
        .ToListAsync();

    return Ok(result);
}

[HttpGet("order-status")]
public async Task<IActionResult> GetOrderStatusDistribution()
{
    var data = await _context.Orders
        .GroupBy(o => o.OrderStatus)
        .Select(g => new
        {
            status = g.Key.ToString(),
            count = g.Count()
        })
        .ToListAsync();

    return Ok(data);
}


}
