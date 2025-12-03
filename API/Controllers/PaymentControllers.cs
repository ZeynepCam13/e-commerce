using API.Dtos;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create")]
        public IActionResult CreatePayment(CreatePaymentDto dto)
        {
            var result = _paymentService.CreatePayment(dto);
            return Ok(new
            {
                html = result.CheckoutFormContent
            });
        }

        // iyzico ödemeyi tamamlayınca buraya POST atar
        [HttpPost("callback")]
        public IActionResult Callback([FromForm] string token)
        {
            // BURADA sipariş oluşturacağız
            // RabbitMQ → fatura → email

            return Ok("OK");
        }
    }
}
