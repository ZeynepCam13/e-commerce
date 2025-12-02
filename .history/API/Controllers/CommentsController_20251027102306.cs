using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly DataContext _context;

        public CommentsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetComments(int productId)
        {
            var comments = await _context.Comments
                .Where(c => c.ProductId == productId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(comments);

        }

[Authorize]
[HttpPost]
public async Task<IActionResult> AddComment([FromBody] Comment comment)
{
    if (comment == null || comment.ProductId == 0 || string.IsNullOrWhiteSpace(comment.Text))
        return BadRequest("Eksik veya geçersiz yorum verisi.");

    // Kullanıcı adını token'dan al
    var username = User.Identity?.Name ?? "Anonim";
    comment.UserName = username;
    comment.CreatedAt = DateTime.UtcNow;

    _context.Comments.Add(comment);
    await _context.SaveChangesAsync();

    return Ok(comment);
}


    }
}