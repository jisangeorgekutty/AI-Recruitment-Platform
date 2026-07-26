using Microsoft.AspNetCore.Identity;
using System;

namespace AiRecruitmentPlatform.Infrastructure.Identity.Models
{
    public class ApplicationUser : IdentityUser<long>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? AvatarUrl { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public string? CompanyId { get; set; }
        public bool IsOnboardingCompleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
