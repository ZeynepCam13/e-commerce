using API.Data;
using API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenAI.Chat;
using OpenAI;


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

    var client = new OpenAIClient(
        Environment.GetEnvironmentVariable("OPENAI_API_KEY")
    );

    var chat = client.GetChatClient("gpt-4o-mini");

    var systemPrompt = $@"
Sen bir e-ticaret sitesinin yapay zekâ asistanısın.
Kullanıcıyla doğal, samimi ve insan gibi konuş.
Asla tablo okur gibi cevap verme.

Siparişler:
{System.Text.Json.JsonSerializer.Serialize(orders)}

Ürünler:
{System.Text.Json.JsonSerializer.Serialize(products)}
";

    var response = await chat.CompleteChatAsync(new ChatMessage[]
    {
        new SystemChatMessage(systemPrompt),
        new UserChatMessage(dto.Message)
    });

    return Ok(new
    {
        type = "text",
        message = response.Value.Content[0].Text
    });
}
}