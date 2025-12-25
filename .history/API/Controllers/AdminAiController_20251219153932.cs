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
        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Brand))
        {
            return BadRequest("Eksik veri");
        }

        // 🔥 ŞİMDİLİK FAKE RESPONSE
        return Ok(new
        {
            description = $"{dto.Brand} markasına ait {dto.Name} şık ve rahat bir üründür.",
            seoTitle = $"{dto.Name} | {dto.Brand}",
            seoDescription = $"{dto.Brand} {dto.Name} uygun fiyat ve hızlı kargo avantajıyla."
        });
    }
}
