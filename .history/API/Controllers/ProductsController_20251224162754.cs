using System.Text.Json;
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
    public async Task<IActionResult> GetProducts(int? id)
    {
        var products = await _context.Products
            .Include(p => p.subSubCategory)
                .ThenInclude(ssc => ssc.SubCategory)
                    .ThenInclude(sc => sc.Category)
            .Include(p => p.ProductSizes)
            .Include(p=>p.ProductColors)
            .Include(p => p.Images)
            .OrderBy(p => p.Id)
            .ToListAsync();

        return Ok(products);
    }


[HttpGet("{id}")]
public async Task<IActionResult> GetProduct(int id)
{
    var product = await _context.Products
        .Include(p => p.Images)
        .Include(p => p.ProductSizes)
        .Include(p => p.ProductColors)
        .Include(p => p.subSubCategory)
            .ThenInclude(ssc => ssc.SubCategory)
                .ThenInclude(sc => sc.Category)
        .FirstOrDefaultAsync(p => p.Id == id);

    if (product == null)
        return NotFound();

    return Ok(product);
}


[Authorize(Roles = "Admin")]
[HttpPost]
public async Task<IActionResult> CreateProduct(
    [FromForm] ProductCreateDto dto,
    [FromForm] List<IFormFile> Images)
{
    if (dto == null)
        return BadRequest("Ürün bilgisi eksik.");

    var product = new Product
    {
        Name = dto.Name,
        Price = dto.Price,
        Stock = dto.Stock,
        Description = dto.Description,
        marka=dto.marka,
        subSubCategoryId = dto.SubSubCategoryId,
        ProductColors = new List<ProductColor>() // 🔴 ŞART
    };

    // 1️⃣ Ürünü önce kaydet → ID oluşsun
    _context.Products.Add(product);
    await _context.SaveChangesAsync();

    // 2️⃣ RENKLER
    if (dto.Colors != null && dto.Colors.Any())
    {
        var colors = dto.Colors.Select(c => new ProductColor
        {
            ProductId = product.Id, // 🔴 ARTIK VAR
            ColorName = c.ColorName,
            ColorCode = c.ColorCode,
            
        }).ToList();

        _context.ProductColors.AddRange(colors);
        await _context.SaveChangesAsync();
    }

    // 3️⃣ BEDENLER
    if (dto.Sizes != null && dto.Sizes.Any())
    {
        var sizes = dto.Sizes.Select(s => new ProductSize
        {
            ProductId = product.Id,
            Size = s.Size,
            Stock = s.Stock
        }).ToList();

        _context.ProductSizes.AddRange(sizes);
        await _context.SaveChangesAsync();
    }

    // 4️⃣ FOTOĞRAFLAR
    if (Images != null && Images.Count > 0)
    {
        var uploadsFolder = Path.Combine(_env.WebRootPath, "images");
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
                ImageUrl = $"/images/{uniqueFileName}"
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



   // [Authorize(Roles = "Admin")]
   // [HttpPost("add")]
//    public async Task<IActionResult> AddProduct([FromBody] Product product)
   // {
//        if (product == null) return BadRequest("Ürün bilgisi eksik.");

       // if (string.IsNullOrEmpty(product.ImageUrl))
      //      product.ImageUrl = "images/default.webp";

      //  _context.Products.Add(product);
       // await _context.SaveChangesAsync();
        //return Ok(product);
  // }


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
          .Include(p=>p.ProductColors)
          .FirstOrDefaultAsync(p => p.Id == id);

      if (product == null)
          return NotFound();
         product.Name = dto.Name;
         product.Description = dto.Description;
         product.Price = dto.Price;
         product.Stock = dto.Stock;
         product.marka=dto.marka;
         
         product.subSubCategoryId = dto.SubSubCategoryId;
    if (dto.Sizes != null)
    {
        _context.ProductSizes.RemoveRange(product.ProductSizes);
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
            .Include(p => p.Images)
            .Include(p => p.subSubCategory)
            .Include(p=>p.ProductColors)
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
        .Include(p => p.Images)
        .Include(p => p.subSubCategory)
            .ThenInclude(ssc => ssc.SubCategory)
                .ThenInclude(sc => sc.Category)
        .Include(p=>p.ProductColors)        
        .Where(p => p.subSubCategory.SubCategory.Category.Id == categoryId)
        .ToListAsync();

    return Ok(products);
}
[HttpGet("bySubCategory/{subCategoryId}")]
public async Task<IActionResult> GetProductsBySubCategory(int subCategoryId)
{
    var products = await _context.Products
        .Include(p => p.Images)
        .Include(p => p.subSubCategory)
            .ThenInclude(ssc => ssc.SubCategory)
        .Include(p=>p.ProductColors)    
        .Where(p => p.subSubCategory.SubCategoryId == subCategoryId)
        .ToListAsync();

    return Ok(products);
}

[HttpGet("bySubSub/{subSubCategoryId}")]
public async Task<IActionResult> GetProductsBySubSubCategory(int subSubCategoryId)
{
    var products = await _context.Products
        .Include(p => p.Images)
        .Include(p => p.subSubCategory)
        .Include(p=>p.ProductColors)
        .Where(p => p.subSubCategoryId == subSubCategoryId)
        .ToListAsync();

    return Ok(products);
}



[HttpGet("{id}/similar")]
public async Task<IActionResult> GetSimilarProducts(int id, int take = 6)
{
    var product = await _context.Products.FindAsync(id);
    if (product == null) return NotFound();

    var sourceEmbedding = await _context.ProductEmbeddings.FindAsync(id);

    if (sourceEmbedding == null)
    {
        var fallback = await _context.Products
            .Where(p => p.Id != id &&
                        p.subSubCategoryId == product.subSubCategoryId)
            .Take(take)
            .ToListAsync();

        return Ok(fallback);
    }

    var sourceVector =
        JsonSerializer.Deserialize<float[]>(sourceEmbedding.Vector)!;
    var allEmbeddings = await _context.ProductEmbeddings
        .Where(x => x.ProductId != id)
        .ToListAsync();

    var scored = allEmbeddings
        .Select(e => new
        {
            ProductId = e.ProductId,
            Score = VectorSimilarity.Cosine(
                sourceVector,
                JsonSerializer.Deserialize<float[]>(e.Vector)!)
        })
        .OrderByDescending(x => x.Score)
        .Take(take)
        .ToList();

    var productIds = scored.Select(x => x.ProductId).ToList();

    var products = await _context.Products
        .Where(p => productIds.Contains(p.Id))
        .ToListAsync();

    return Ok(products);
}


}