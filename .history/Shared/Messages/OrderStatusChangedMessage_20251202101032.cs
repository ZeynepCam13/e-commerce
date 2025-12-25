namespace Shared.Messages
{
    public class OrderStatusChangedMessage
    {
        public int OrderId{get;set;}
        public string Email{ get; set; }=null!;
        public string FullName { get; set; }=null!;
        public string NewStatus{get;set;}=null!;
        public string Message { get; set; } =" ";

    }
}