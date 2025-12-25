using API.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ProductEmbeddingConfiguration
    : IEntityTypeConfiguration<ProductEmbedding>
{
    public void Configure(EntityTypeBuilder<ProductEmbedding> builder)
    {
        builder.HasKey(x => x.ProductId);

        builder
            .HasOne(x => x.Product)
            .WithOne()
            .HasForeignKey<ProductEmbedding>(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(x => x.Vector)
               .IsRequired();

        builder.Property(x => x.Model)
               .HasMaxLength(100);
    }
}
