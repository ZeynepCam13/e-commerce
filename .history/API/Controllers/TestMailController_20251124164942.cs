using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestMailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public TestMailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpGet("send")]
    public async Task<IActionResult> SendTestMail()
    {
        await _emailService.SendEmailAsync("kendi@gmail.com", "Test Mail", "Bu bir test mailidir!");
        return Ok("Mail gönderildi!");
    }
}
