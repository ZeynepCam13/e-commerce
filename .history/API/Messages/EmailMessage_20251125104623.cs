using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace API.Messages
{
    public class EmailMessage
    {
        public string To{get;set;}
        public string Subject{get;set;}
        public string Body{get;set;}
    }
}