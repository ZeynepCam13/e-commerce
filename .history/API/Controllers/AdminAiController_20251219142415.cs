using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/admin/ai")]
[Authorize(Roles = "Admin")]
public class AdminAiController : ControllerBase
{
    [HttpPost("product-content")]
    public IActionResult GenerateProductContent(
        [FromBody] AiProductContentRequestDto dto)
    {
        // ⚠️ ŞİMDİLİK FAKE (sonra OpenAI bağlanacak)

        var description =
            $"{dto.Brand} markasına ait {dto.Name}, {dto.CategoryName} " +
            $"kategorisinde yer alan, şık tasarımı ve kaliteli kumaşıyla öne çıkan bir üründür.";

        var seoTitle =
            $"{dto.Name} | {dto.Brand} {dto.CategoryName}";

        var seoDescription =
            $"{dto.Brand} {dto.Name} satın al. En uygun fiyat, hızlı kargo ve güvenli alışveriş.";

        return Ok(new
        {
            description,
            seoTitle,
            seoDescription
        });
    }
}
