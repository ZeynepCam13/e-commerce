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
        [FromBody] AiProductContentDto dto)
    {
        if (dto == null)
            return BadRequest("DTO boş");

        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.marka))
        {
            return BadRequest("Eksik veri");
        }

        return Ok(new
        {
            description = $"{dto.marka} markasına ait {dto.Name} şık ve rahat bir üründür.",
            seoTitle = $"{dto.Name} | {dto.marka}",
            seoDescription = $"{dto.marka} {dto.Name} uygun fiyat ve hızlı kargo avantajıyla."
        });
    }
}

