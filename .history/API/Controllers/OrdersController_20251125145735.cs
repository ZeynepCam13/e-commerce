using API.Data;
using API.DTO;
using API.Entity;
using API.Extensions;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.Messages;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IPublishEndpoint _publishEndpoint;

        public OrdersController(DataContext context, IPublishEndpoint publishEndpoint)
        {
            _context = context;
            _publishEndpoint = publishEndpoint;
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
                    Quantity = item.Quantity
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

                await _publishEndpoint.Publish(new InvoiceMessage
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
    }
}
