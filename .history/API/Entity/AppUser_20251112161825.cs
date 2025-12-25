using Microsoft.AspNetCore.Identity;

namespace API.Entity;

public class AppUser : IdentityUser
{
      public string? OtpCode { get; set; }
        public DateTime? OtpExpireTime { get; set; }
    public string? Name { get; set; }
}