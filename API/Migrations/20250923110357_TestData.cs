using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class TestData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Description", "ImageUrl", "IsActive", "Name", "Price", "Stock" },
                values: new object[,]
                {
                    { 1, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet massa vel justo condimentum luctus vel in lectus. Vivamus pellentesque, dolor vel pharetra mollis, erat ex fringilla est, at convallis erat nisl nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.", "/images/products/sb-ang1.png", true, "Angular Speedster Board 2000", 20000m, 100 },
                    { 2, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet massa vel justo condimentum luctus vel in lectus. Vivamus pellentesque, dolor vel pharetra mollis, erat ex fringilla est, at convallis erat nisl nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.", "/images/products/sb-ang1.png", true, "Angular Speedster Board 2000", 20000m, 100 },
                    { 3, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet massa vel justo condimentum luctus vel in lectus. Vivamus pellentesque, dolor vel pharetra mollis, erat ex fringilla est, at convallis erat nisl nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.", "/images/products/sb-ang1.png", true, "Angular Speedster Board 2000", 20000m, 100 },
                    { 4, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales, enim et facilisis commodo, est augue venenatis ligula, in convallis erat felis nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet massa vel justo condimentum luctus vel in lectus. Vivamus pellentesque, dolor vel pharetra mollis, erat ex fringilla est, at convallis erat nisl nec nisi. In eleifend ligula a nunc efficitur, ut finibus enim fringilla.", "/images/products/sb-ang1.png", true, "Angular Speedster Board 2000", 20000m, 100 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
