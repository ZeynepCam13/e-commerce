using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductCategoryStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "subSubCategoryId",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_subSubCategoryId",
                table: "Products",
                column: "subSubCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_SubSubCategories_subSubCategoryId",
                table: "Products",
                column: "subSubCategoryId",
                principalTable: "SubSubCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_SubSubCategories_subSubCategoryId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_subSubCategoryId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "subSubCategoryId",
                table: "Products");
        }
    }
}
