using API.Data;
using API.Dtos;
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
        var userId = User.Identity!.Name;

        // Kullanıcının siparişleri
        var orders = await _context.Orders
            .Where(o => o.CustomerId == userId)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                Status = o.OrderStatus.ToString(),
                Total = o.SubTotal + o.DeliveryFree,
                Date = o.OrderDate.ToString("dd.MM.yyyy")
            })
            .ToListAsync();

        // Aktif ürünler (sınırlı)
        var products = await _context.Products
            .Where(p => p.IsActive)
            .Take(10)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price
            })
            .ToListAsync();

        return Ok(new
        {
            userMessage = dto.Message,
            context = new
            {
                orders,
                products
            }
        });
    }
}