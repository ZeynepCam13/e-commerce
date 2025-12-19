using API.Data;
using API.Dtos;
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
            .Include(p => p.subSubCategory)
                .ThenInclude(ssc => ssc.SubCategory)
                    .ThenInclude(sc => sc.Category)
            .Include(p => p.ProductSizes)
            .Include(p => p.Images)
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
        .Include(p=> p.Images)
        .Include(p=>p.ProductSizes)
            .Include(p => p.subSubCategory)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

[Authorize(Roles = "Admin")]
[HttpPost]
public async Task<IActionResult> CreateProduct(
    [FromForm] ProductCreateDto dto,
    [FromForm] List<IFormFile> Images)
{
    if (dto == null) return BadRequest("Ürün bilgisi eksik.");

    var product = new Product
    {
        Name = dto.Name,
        Price = dto.Price,
        Stock = dto.Stock,
        Description = dto.Description,
        subSubCategoryId = dto.SubSubCategoryId,

         
    };
    

    _context.Products.Add(product);
    await _context.SaveChangesAsync();

        if (dto.Sizes != null && dto.Sizes.Any())
        {
            product.ProductSizes=dto.Sizes.Select(s=>new ProductSize
            {
                Size=s.Size,
                Stock=s.Stock,
                ProductId=product.Id
            }).ToList();

            _context.ProductSizes.AddRange(product.ProductSizes);
            await _context.SaveChangesAsync();
        }

    // FOTOĞRAFLAR
    if (Images != null && Images.Count > 0)
    {
        var uploadsFolder = Path.Combine(_env.WebRootPath, "images");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        int index = 0;

        foreach (var file in Images)
        {
            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var image = new ProductImage
            {
                ProductId = product.Id,
                ImageUrl = $"images/{uniqueFileName}"
            };

            _context.ProductImages.Add(image);

            if (index == 0)
                product.ImageUrl = image.ImageUrl;

            index++;
        }

        await _context.SaveChangesAsync();
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

     public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDto dto)
{
      var product = await _context.Products
          .Include(p => p.ProductSizes)
          .FirstOrDefaultAsync(p => p.Id == id);

      if (product == null)
          return NotFound();

    // Temel bilgiler
         product.Name = dto.Name;
         product.Description = dto.Description;
         product.Price = dto.Price;
         product.Stock = dto.Stock;
         product.subSubCategoryId = dto.SubSubCategoryId;

    // 🟢 BEDENLER
    if (dto.Sizes != null)
    {
        // Eski bedenleri sil
        _context.ProductSizes.RemoveRange(product.ProductSizes);

        // Yeni bedenleri ekle
        product.ProductSizes = dto.Sizes.Select(s => new ProductSize
        {
            Size = s.Size,
            Stock = s.Stock,
            ProductId = product.Id
        }).ToList();

        _context.ProductSizes.AddRange(product.ProductSizes);
    }

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
            .Include(p => p.subSubCategory)
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
        .Include(p => p.subSubCategory)
            .ThenInclude(ssc => ssc.SubCategory)
                .ThenInclude(sc => sc.Category)
        .Where(p => p.subSubCategory.SubCategory.Category.Id == categoryId)
        .ToListAsync();

    return Ok(products);
}
[HttpGet("bySubCategory/{subCategoryId}")]
public async Task<IActionResult> GetProductsBySubCategory(int subCategoryId)
{
    var products = await _context.Products
        .Include(p => p.subSubCategory)
            .ThenInclude(ssc => ssc.SubCategory)
        .Where(p => p.subSubCategory.SubCategoryId == subCategoryId)
        .ToListAsync();

    return Ok(products);
}

[HttpGet("bySubSub/{subSubCategoryId}")]
public async Task<IActionResult> GetProductsBySubSubCategory(int subSubCategoryId)
{
    var products = await _context.Products
        .Include(p => p.subSubCategory)
        .Where(p => p.subSubCategoryId == subSubCategoryId)
        .ToListAsync();

    return Ok(products);
}




}