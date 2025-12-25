using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class SubCategoryController : ControllerBase
{
    private readonly DataContext _context;
    public SubCategoryController(DataContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<ActionResult> GetSubCategories()
    {
        var list = await _context.SubCategories
            .Include(sc => sc.SubSubCategories)
            .ToListAsync();

        return Ok(list);
    }
    [HttpPost]
    public async Task<ActionResult<SubCategory>> CreateSubCategory(SubCategory subCategory)
    {
        _context.SubCategories.Add(subCategory);
        await _context.SaveChangesAsync();
        return Ok(subCategory);
    }
}
