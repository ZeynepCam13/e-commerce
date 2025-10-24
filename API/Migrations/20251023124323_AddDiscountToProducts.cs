using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscountToProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "Description", "ImageUrl", "IsActive", "Name", "Price", "Stock" },
                values: new object[,]
                {
                    { 1, null, "Tommy Hilfiger", "a1.webp", true, "Spor Ayakkabı", 7000m, 100 },
                    { 2, null, "Stradivarius", "a2.webp", true, "Blazer Ceket", 800m, 100 },
                    { 3, null, "Stradivarius", "a3.webp", false, "Deri Blazer Ceket", 900m, 100 },
                    { 4, null, "Mango", "a4.webp", true, "Çanta", 1000m, 100 },
                    { 5, null, "Armine", "a5.webp", true, "Çanta", 800m, 100 },
                    { 6, null, "Rayban", "a6.webp", true, "Güneş Gözlüğü", 5000m, 100 },
                    { 7, null, "Mavi", "a7.webp", true, "Pantolon", 1000m, 100 },
                    { 8, null, "Fossil", "a8.webp", true, "Kol Saati", 1000m, 100 },
                    { 9, null, "Manuka", "a9.webp", true, "Süet Ceket", 1500m, 100 }
                });
        }
    }
}
