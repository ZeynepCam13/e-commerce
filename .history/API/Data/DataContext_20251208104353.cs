using API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, string>(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Category> Categories { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    
    public DbSet<Comment> Comments { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<ProductSize> ProductSizes { get; set; }




    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProductSize>()
             .HasOne(ps => ps.Product)
             .WithMany(p => p.ProductSizes)
             .HasForeignKey(ps => ps.ProductId)
             .OnDelete(DeleteBehavior.Cascade);

        

        // modelBuilder.Entity<Product>().HasData(
        //     new List<Product> {
        //         new Product { Id=1, Name="Spor Ayakkabı", Description="Tommy Hilfiger", ImageUrl="a1.webp", Price=7000, IsActive=true, Stock=100  },
        //         new Product { Id=2, Name="Blazer Ceket", Description="Stradivarius", ImageUrl="a2.webp", Price=800, IsActive=true, Stock=100  },
        //         new Product { Id=3, Name="Deri Blazer Ceket", Description="Stradivarius", ImageUrl="a3.webp", Price=900, IsActive=false, Stock=100  },
        //         new Product { Id=4, Name="Çanta", Description="Mango", ImageUrl="a4.webp", Price=1000, IsActive=true, Stock=100  },
        //         new Product { Id=5, Name="Çanta", Description="Armine", ImageUrl="a5.webp", Price=800, IsActive=true, Stock=100  },
        //         new Product { Id=6, Name="Güneş Gözlüğü", Description="Rayban", ImageUrl="a6.webp", Price=5000, IsActive=true, Stock=100  },
        //         new Product { Id=7, Name="Pantolon", Description="Mavi", ImageUrl="a7.webp", Price=1000, IsActive=true, Stock=100  },
        //         new Product { Id=8, Name="Kol Saati", Description="Fossil", ImageUrl="a8.webp", Price=1000, IsActive=true, Stock=100  },
        //         new Product { Id=9, Name="Süet Ceket", Description="Manuka", ImageUrl="a9.webp", Price=1500, IsActive=true, Stock=100  },

        //     }
        // );


    }

}