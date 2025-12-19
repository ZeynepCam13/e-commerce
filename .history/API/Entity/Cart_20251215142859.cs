namespace API.Entity;

public class Cart
{
    public int CartId { get; set; }
    public string CustomerId { get; set; } = null!;
    public List<CartItem> CartItems { get; set; } = new();

    public void AddItem(Product product, int quantity,string size,int? colorId)
    {
        var item = CartItems
        .Where(c => c.ProductId == product.Id&& c.Size==size&&c.ColorId==colorId)
        .FirstOrDefault();

        if (item == null)
        {
            CartItems.Add(new CartItem
             { Product = product,
              Quantity = quantity,
              Size=size,
              ColorId=colorId
             });
        }
        else
        {
            item.Quantity += quantity;
        }
    }

    public void DeleteItem(int productId, int quantity,string size,int? colorId)
    {
        var item = CartItems.Where(c => c.ProductId == productId&&c.Size==size&&c.ColorId==colorId).FirstOrDefault();

        if (item == null) return;

        item.Quantity -= quantity;

        if (item.Quantity == 0)
        {
            CartItems.Remove(item);
        }
    }
}

public class CartItem
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }

    public int Quantity { get; set; }

    public string Size { get; set; }

    // 🔵 YENİ
    public int? ColorId { get; set; }
    public ProductColor? Color { get; set; }

    public int CartId { get; set; }
    public Cart Cart { get; set; }=null!;
    
}
