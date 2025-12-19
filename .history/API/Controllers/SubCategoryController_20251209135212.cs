using API.Data;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SubCategoryController : ControllerBase
{
    private readonly DataContext _context;
    public SubCategoryController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<SubCategory>> CreateSubCategory(SubCategory subCategory)
    {
        _context.SubCategories.Add(subCategory);
        await _context.SaveChangesAsync();
        return Ok(subCategory);
    }
}
