using API.Data;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SubSubCategoryController : ControllerBase
{
    private readonly DataContext _context;
    public SubSubCategoryController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<SubSubCategory>> CreateSubSubCategory(SubSubCategory subSubCategory)
    {
        _context.SubSubCategories.Add(subSubCategory);
        await _context.SaveChangesAsync();
        return Ok(subSubCategory);
    }
}
