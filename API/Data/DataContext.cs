using API.Entity;
using Microsoft.EntityFrameworkCore;
namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }
    public DbSet<Product> Products => Set<Product>();

    public DbSet<Cart> Carts => Set<Cart>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>().HasData(
            new List<Product>
            {
                new Product{
                    Id=1,
                    Name="Apple watch",
                    Description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet massa vel justo condimentum luctus vel in lectus. Vivamus pellentesque, dolor vel pharetra mollis, erat ex fringilla est, at convallis erat nisl nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.",
                    Price=20000,
                    imageUrl="/images/products/sb-ang1.png",
                    IsActive=true,
                    Stock=100,
                },
                 new Product{
                    Id=2,
                    Name="Angular Speedster Board 2000",
                    Description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet massa vel justo condimentum luctus vel in lectus. Vivamus pellentesque, dolor vel pharetra mollis, erat ex fringilla est, at convallis erat nisl nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.",
                    Price=20000,
                    imageUrl="/images/products/sb-ang1.png",
                    IsActive=true,
                    Stock=100,
                },
                 new Product{
                    Id=3,
                    Name="Angular Speedster Board 2000",
                    Description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet massa vel justo condimentum luctus vel in lectus. Vivamus pellentesque, dolor vel pharetra mollis, erat ex fringilla est, at convallis erat nisl nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.",
                    Price=20000,
                    imageUrl="/images/products/sb-ang1.png",
                    IsActive=true,
                    Stock=100,
                },
                 new Product{
                    Id=4,
                    Name="Angular Speedster Board 2000",
                    Description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet massa vel justo condimentum luctus vel in lectus. Vivamus pellentesque, dolor vel pharetra mollis, erat ex fringilla est, at convallis erat nisl nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.",
                    Price=20000,
                    imageUrl="/images/products/sb-ang1.png",
                    IsActive=true,
                    Stock=100,
                }
            }

        );

    }
}