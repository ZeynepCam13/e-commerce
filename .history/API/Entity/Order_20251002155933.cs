using System;
using System.Collections.Generic;


namespace API.Entity
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? City { get; set; }
        public string? AddresLine { get; set; }
        public string? CustomerId { get; set; }
        public OrderStatus OrderStatus{ get; set; }
        
    }

    public enum OrderStatus
    {
        Pending,
        Approved,
        PaymentFailed,
        Completed

    }
}