using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class Favorite
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CustomerId { get; set; } = null!;

        [ForeignKey("Product")]
        public int ProductId { get; set; }

        public Product Product { get; set; } = null!;
    }
    

}