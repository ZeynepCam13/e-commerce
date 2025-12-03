using API.Data;
using API.Entity;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
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

        // ---------------------------------
        // GET ALL PRODUCTS
        // ---------------------------------
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .OrderBy(p => p.Id)
                .ToListAsync();

            return Ok(products);
        }

        // ---------------------------------
        // GET PRODUCT BY ID
        // ---------------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // ---------------------------------
        // CREATE PRODUCT + MULTIPLE IMAGES (NEW!!)
        // ---------------------------------
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateDto dto)
        {
            if (dto == null) return BadRequest("Ürün bilgisi eksik.");

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                Stock = dto.Stock,
                Description = dto.Description,
                CategoryId = dto.CategoryId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync(); // ID oluşur

            // FOTOĞRAFLAR VAR MI?
            if (dto.Images != null && dto.Images.Count > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                foreach (var file in dto.Images)
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

                    // İlk resim otomatik kapak
                    if (string.IsNullOrEmpty(product.ImageUrl))
                        product.ImageUrl = image.ImageUrl;
                }

                await _context.SaveChangesAsync();
            }
            else
            {
                // Resim yoksa default kapak
                product.ImageUrl = "images/default.webp";
                await _context.SaveChangesAsync();
            }

            return Ok(product);
        }

        // ---------------------------------
        // UPDATE PRODUCT (resimler hariç)
        // ---------------------------------
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updatedProduct)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.Stock = updatedProduct.Stock;
            product.CategoryId = updatedProduct.CategoryId;

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // ---------------------------------
        // DELETE PRODUCT
        // ---------------------------------
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

        // ---------------------------------
        // OLD IMAGE UPLOAD (ARTIK GEREKSİZ AMA İSTER KALSIN)
        // ---------------------------------
        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/images")]
        public async Task<IActionResult> UploadProductImages(int id, [FromForm] List<IFormFile> files)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound("Ürün bulunamadı");

            if (files == null || files.Count == 0)
                return BadRequest("Dosya seçilmedi.");

            var uploadsFolder = Path.Combine(_env.WebRootPath, "images");

            foreach (var file in files)
            {
                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                var image = new ProductImage
                {
                    ProductId = id,
                    ImageUrl = $"images/{uniqueFileName}"
                };

                _context.ProductImages.Add(image);

                if (string.IsNullOrEmpty(product.ImageUrl))
                    product.ImageUrl = image.ImageUrl;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Resimler başarıyla eklendi." });
        }
    }
}
