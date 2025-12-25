using API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public static class SeedDatabase
{
    public static async Task InitializeAsync(IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<DataContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();

        // 1) MIGRATIONLARI UYGULA
        await context.Database.MigrateAsync();

        // 2) KATEGORİ SEED
        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new Category { Name = "Ayakkabı" },
                new Category { Name = "Elbise" },
                new Category { Name = "Çanta" },
                new Category { Name = "Aksesuar" }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // 3) ROL SEED
        if (!roleManager.Roles.Any())
        {
            var customer = new AppRole { Name = "Customer" };
            var admin = new AppRole { Name = "Admin" };

            await roleManager.CreateAsync(customer);
            await roleManager.CreateAsync(admin);
        }

        // 4) KULLANICI SEED
        if (!userManager.Users.Any())
        {
            var customer = new AppUser { Name = "Zeynep Çam", UserName = "zeynepcam", Email = "zeynep@gmail.com" };
            var admin = new AppUser { Name = "Meryem Çam", UserName = "meryemcam", Email = "meryem@gmail.com" };

            await userManager.CreateAsync(customer, "Customer_123");
            await userManager.AddToRoleAsync(customer, "Customer");

            await userManager.CreateAsync(admin, "Admin_123");
            await userManager.AddToRolesAsync(admin, ["Admin", "Customer"]);
        }
    }
}
