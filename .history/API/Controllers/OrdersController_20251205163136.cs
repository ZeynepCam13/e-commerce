using API.Data;
using API.DTO;
using API.Entity;
using API.Extensions;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.Messages;
using Twilio.TwiML.Messaging;
namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ISendEndpointProvider _sendEndpointProvider;

        public OrdersController(DataContext context, ISendEndpointProvider sendEndpointProvider)
        {
            _context = context;
            _sendEndpointProvider = sendEndpointProvider;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetOrder()
        {
            return await _context.Orders
                .Include(i => i.OrderItems)
                .OrderToDTO()
                .Where(i => i.CustomerId == User.Identity!.Name)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<List<OrderDTO>>> GetAllOrders()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .OrderToDTO()
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO?>> GetOrder(int id)
        {
            return await _context.Orders
                .Include(i => i.OrderItems)
                .OrderToDTO()
                .Where(i => i.CustomerId == User.Identity!.Name && i.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDTO orderDTO)
        {
            var cart = await _context.Carts
                .Include(i => i.CartItems)
                .ThenInclude(i => i.Product)
                .Where(i => i.CustomerId == User.Identity!.Name)
                .FirstOrDefaultAsync();

            if (cart == null)
                return BadRequest(new ProblemDetails { Title = "Problem getting cart" });

            var items = new List<OrderItem>();

            foreach (var item in cart.CartItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);

                var orderItem = new OrderItem
                {
                    ProductId = product!.Id,
                    ProductName = product!.Name,
                    ProductImage = product!.ImageUrl,
                    Price = product.Price,
                    Quantity = item.Quantity,
                    Sizes=item.Sizes ?? ""
                };

                items.Add(orderItem);
                product.Stock -= item.Quantity;
            }

            var subTotal = items.Sum(i => i.Price * i.Quantity);
            var deliveryFee = 0;

            var order = new Order
            {
                OrderItems = items,
                CustomerId = User.Identity!.Name,
                FirstName = orderDTO.FirstName,
                LastName = orderDTO.LastName,
                Phone = orderDTO.Phone,
                City = orderDTO.City,
                AddresLine = orderDTO.AddresLine,
                SubTotal = subTotal,
                DeliveryFree = deliveryFee,
                OrderDate = DateTime.UtcNow,
                OrderStatus = 0
            };

            _context.Orders.Add(order);
            _context.Carts.Remove(cart);

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == User.Identity!.Name);

                // 📌 INVOICE QUEUE’YA GÖNDER
                var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:invoice-queue"));

                await endpoint.Send(new InvoiceMessage
                {
                    OrderId = order.Id,
                    Email = user!.Email!,
                    FullName = $"{orderDTO.FirstName} {orderDTO.LastName}",
                    AddressLine = orderDTO.AddresLine,
                    City = orderDTO.City,
                    SubTotal = subTotal,
                    DeliveryFee = deliveryFee,
                    Items = items.Select(i => new InvoiceItem
                    {
                        ProductName = i.ProductName,
                        Quantity = i.Quantity,
                        Price = i.Price
                    }).ToList()
                });

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order.Id);
            }

            return BadRequest(new ProblemDetails { Title = "Problem creating order" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int id, UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound(new ProblemDetails { Title = "Order not found" });

            var newStatus = (OrderStatus)dto.Status;

            // İleri yönlü kontrol
            if ((int)newStatus <= (int)order.OrderStatus)
                return BadRequest("Sipariş durumu sadece ileri yönde güncellenebilir.");

            order.OrderStatus = newStatus;

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == order.CustomerId);

            await _context.SaveChangesAsync();

          if (order.OrderStatus == OrderStatus.Completed)
            {
                var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:order-status-queue"));

                await endpoint.Send(new OrderStatusChangedMessage
                {
                    OrderId = order.Id,
                    Email = user?.Email ?? "",
                    FullName = $"{order.FirstName} {order.LastName}",
                    NewStatus = "Kargoya Verildi",
                    Message = $@"
                        <h2>Merhaba {order.FirstName},</h2>
                        <p>Siparişiniz <strong>kargoya verilmiştir!</strong></p>
                        <p><b>Sipariş Numarası:</b> {order.Id}</p>
                        <p><b>Toplam Tutar:</b> {order.SubTotal} TL</p>
                        <br/>
                        <p>Kargonuz yola çıktı, en kısa sürede sizde olacak 💙</p>
                        <p>E-Ticaret Ekibi</p>"
                                       

                    
                });
            }

            return NoContent();
        }
    }
}
