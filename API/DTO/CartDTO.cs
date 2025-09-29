using System.ComponentModel;
using API.Entity;

namespace API.DTO;

public class CartDTO
{
    public int CartId { get; set; }
    public string? CustomerId { get; set; } = null;
    public List<CartItemDTO> CartItems { get; set; } = new();
}

public class CartItemDTO
{
    
    public string? Name { get; set; }
    public decimal Price{ get; set; }
    public string? imageUrl{ get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    
}