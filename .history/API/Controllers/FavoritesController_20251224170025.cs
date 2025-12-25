
using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly DataContext _context;
        public  FavoritesController(DataContext context)
        {
            _context=context;
        }
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetFavorites()
        {
            var username = User.Identity!.Name;
            var favorites = await _context.Favorites
                            .Include(f => f.Product)
                                .ThenInclude(p=>p.Images)
                            .Where(f => f.CustomerId == username)
                            .Select(f => f.Product)
                            .ToListAsync();

            return Ok(favorites);

        }

        [HttpPost("{productId}")]
        public async Task<ActionResult> AddToFavorites(int productId)
        {
            var username = User.Identity!.Name;

            if (await _context.Favorites.AnyAsync(f => f.CustomerId == username && f.ProductId == productId))
                return BadRequest("Bu ürün zaten favorilerinde mevcut");
            var favorite = new Favorite
            {
                CustomerId = username!,
                ProductId = productId
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok("Ürün favorilere eklendi.");
        }

        [HttpDelete("{productId}")]

        public async Task<ActionResult>RemoveFromFavorites(int productId)
        {
            var username = User.Identity!.Name;

            var fav =  _context.Favorites
                .FirstOrDefault(f => f.CustomerId == username && f.ProductId == productId);


            if (fav == null) return NotFound();

            _context.Favorites.Remove(fav);
            await _context.SaveChangesAsync();

            return Ok("Favorilerden kaldırıldı.");
        }
    }
}