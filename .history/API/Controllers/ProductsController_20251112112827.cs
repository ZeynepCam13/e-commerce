using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IWebHostEnvironment _env;
    public ProductsController(DataContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }


    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .OrderBy(p => p.Id)
            .ToListAsync();

        return Ok(products);
    }



    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("add")]
    public async Task<IActionResult> AddProduct([FromBody] Product product)
    {
        if (product == null) return BadRequest("Ürün bilgisi eksik.");

        if (string.IsNullOrEmpty(product.ImageUrl))
            product.ImageUrl = "images/default.webp";

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return Ok(product);
    }


    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Ürün silindi." });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product updatedProduct)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = updatedProduct.Name;
        product.Description = updatedProduct.Description;
        product.Price = updatedProduct.Price;
        product.Stock = updatedProduct.Stock;
        product.ImageUrl = updatedProduct.ImageUrl;
        product.CategoryId = updatedProduct.CategoryId;

        await _context.SaveChangesAsync();

        return Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Geçersiz dosya.");

        var uploadsFolder = Path.Combine(_env.WebRootPath, "images");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }


        return Ok(new { imageUrl = $"images/{uniqueFileName}" });
    }



    [Authorize(Roles = "Admin")]
    [HttpPut("discount/{id}")]
    public async Task<IActionResult> UpdateDiscount(int id, [FromBody] int discount)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        if (discount < 0 || discount > 100)
            return BadRequest("İndirim oranı 0 ile 100 arasında olmalıdır.");


        if (product.OriginalPrice == null || product.OriginalPrice == 0)
            product.OriginalPrice = product.Price;

        product.Discount = discount;

        if (discount > 0)
            product.Price = product.OriginalPrice.Value - (product.OriginalPrice.Value * discount / 100m);
        else
            product.Price = product.OriginalPrice.Value;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "İndirim uygulandı",
            discount = product.Discount,
            newPrice = product.Price
        });
    }

    [HttpGet("discounted")]
    public async Task<IActionResult> GetDiscountedProducts()
    {
        var discountedProducts = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Discount > 0)
            .ToListAsync();

        if (!discountedProducts.Any())
            return Ok(new { message = "Şu an indirimde ürün yok" });

        return Ok(discountedProducts);
    }



    [HttpGet("byCategory/{categoryId}")]
    public async Task<IActionResult> GetProductsByCategory(int categoryId)
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();

        return Ok(products);
    }

    [Authorize(Roles = "Admin")]
[HttpPost("{id}/images")]
public async Task<IActionResult> UploadProductImages(int id, [FromForm] List<IFormFile> files)
{
    var product = await _context.Products.FindAsync(id);
    if (product == null)
        return NotFound("Ürün bulunamadı");

    if (files == null || files.Count == 0)
        return BadRequest("Herhangi bir dosya seçilmedi.");

    var uploadsFolder = Path.Combine(_env.WebRootPath, "images");
    if (!Directory.Exists(uploadsFolder))
        Directory.CreateDirectory(uploadsFolder);

    foreach (var file in files)
    {
        var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var image = new ProductImage
        {
            ProductId = id,
            ImageUrl = $"/images/{uniqueFileName}"
        };

        _context.ProductImages.Add(image);
    }

    await _context.SaveChangesAsync();
    return Ok(new { message = "Resimler başarıyla eklendi." });
}

}