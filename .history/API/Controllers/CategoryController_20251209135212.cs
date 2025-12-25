using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entity;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly DataContext _context;
        public CategoryController(DataContext context)
        {
            _context = context;
        }
    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetCategories()
    {
        var categories = await _context.Categories
            .Include(c => c.SubCategories)
              .ThenInclude(sc => sc.SubSubCategories)
            .ToListAsync();

     return Ok(categories);
    }

        
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }
    }
}
