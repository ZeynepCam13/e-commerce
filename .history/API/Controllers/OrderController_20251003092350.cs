using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DataContext _context;

        public OrderController(DataContext context)
        {
            _context = context;

        }
         [HttpGet("GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder()
        {
            return await _context.Orders
                        .Include(i => i.OrderItems)
                        .Where(i => i.CustomerId == User.Identity!.Name)
                        .ToListAsync();

        }
        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            return await _context.Orders
                        .Include(i => i.OrderItems)
                        .OrderToDTO()
                        .Where(i => i.CustomerId == User.Identity!.Name && i.Id == id)
                        .FirstOrDefaultAsync();

        }
    }
}