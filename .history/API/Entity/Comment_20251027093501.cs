namespace API.Entity
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public string UserName { get; set; } = string.Empty;
    }
}