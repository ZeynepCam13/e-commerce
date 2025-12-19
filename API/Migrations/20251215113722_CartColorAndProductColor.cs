using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class CartColorAndProductColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CartItemId",
                table: "CartItem",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "ColorId",
                table: "CartItem",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CartItem_ColorId",
                table: "CartItem",
                column: "ColorId");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItem_ProductColors_ColorId",
                table: "CartItem",
                column: "ColorId",
                principalTable: "ProductColors",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItem_ProductColors_ColorId",
                table: "CartItem");

            migrationBuilder.DropIndex(
                name: "IX_CartItem_ColorId",
                table: "CartItem");

            migrationBuilder.DropColumn(
                name: "ColorId",
                table: "CartItem");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "CartItem",
                newName: "CartItemId");
        }
    }
}
