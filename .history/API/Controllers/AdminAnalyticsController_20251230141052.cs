using API.Data;
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

    /// <summary>
    /// Dashboard üst kartları (KPI)
    /// </summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalProducts = await _context.Products.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();

        var totalRevenue = await _context.Orders
            .Where(o => o.OrderStatus == "Completed") // varsa
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

        return Ok(new
        {
            totalProducts,
            totalOrders,
            totalRevenue
        });
    }
}
