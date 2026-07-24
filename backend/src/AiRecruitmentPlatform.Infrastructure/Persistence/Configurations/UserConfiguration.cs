using AiRecruitmentPlatform.Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            var hasher = new PasswordHasher<ApplicationUser>();
            builder.HasData(
                new ApplicationUser
                {
                    Id = 1,
                    FirstName = "Super",
                    LastName = "Admin",
                    Email = "admin@airecruitmentplatform.com",
                    NormalizedEmail = "ADMIN@AIRECRUITMENTPLATFORM.COM",
                    UserName = "admin",
                    NormalizedUserName = "ADMIN",
                    PasswordHash = hasher.HashPassword(null!, "1"),
                    EmailConfirmed = true,
                    SecurityStamp = "F3A1877B-B990-4F13-8E87-C90DF070B2C9",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
