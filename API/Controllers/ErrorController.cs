using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]

public class ErrorController : ControllerBase
{
    [HttpGet("not-found")]
    public IActionResult ErrorNotFound()
    {
        return NotFound();//404
    }

    [HttpGet("bad-request")]
    public IActionResult BadRequestNotError()
    {
        return BadRequest();//400
    }

    [HttpGet("unauthorized")]
    public IActionResult UnAuthorizedError()
    {
        return Unauthorized();//401
    }
    [HttpGet("validation-error")]
    public IActionResult ValidationError()
    {
        ModelState.AddModelError("validation error 1", "validaiton error details");
        ModelState.AddModelError("validation error 2", "validaiton error details");
        return ValidationProblem();
    }

    [HttpGet("server-error")]
    public IActionResult ServerError()
    {
        throw new Exception("server error");
    }
}