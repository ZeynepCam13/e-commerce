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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().HasData(
            new List<Product> {
                new Product { Id=1, Name="Spor Ayakkabı", Description="Tommy Hilfiger", ImageUrl="1.webp", Price=7000, IsActive=true, Stock=100  },
                new Product { Id=2, Name="Blazer Ceket", Description="Stradivarius", ImageUrl="2.webp", Price=800, IsActive=true, Stock=100  },
                new Product { Id=3, Name="Deri Blazer Ceket", Description="Stradivarius", ImageUrl="3.webp", Price=900, IsActive=false, Stock=100  },
                new Product { Id=4, Name="Çanta", Description="Mango", ImageUrl="4.webp", Price=1000, IsActive=true, Stock=100  },
                new Product { Id=5, Name="Çanta", Description="Armine", ImageUrl="5.webp", Price=800, IsActive=true, Stock=100  },
                new Product { Id=6, Name="Güneş Gözlüğü", Description="Rayban", ImageUrl="6.webp", Price=5000, IsActive=true, Stock=100  },
                new Product { Id=7, Name="Pantolon", Description="Mavi", ImageUrl="7.webp", Price=1000, IsActive=true, Stock=100  },
                new Product { Id=8, Name="Kol Saati", Description="Fossil", ImageUrl="8.webp", Price=1000, IsActive=true, Stock=100  },
                new Product { Id=9, Name="Süet Ceket", Description="Manuka", ImageUrl="9.jpg", Price=1500, IsActive=true, Stock=100  },
  
            }
        );


    }

}