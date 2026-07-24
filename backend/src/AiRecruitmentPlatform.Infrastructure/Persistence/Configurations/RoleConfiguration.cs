using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole<long>>
    {
        public void Configure(EntityTypeBuilder<IdentityRole<long>> builder)
        {
            builder.HasData(
                new IdentityRole<long>
                {
                    Id = 1,
                    Name = "Super Administrator",
                    NormalizedName = "SUPER ADMINISTRATOR"
                },
                new IdentityRole<long>
                {
                    Id = 2,
                    Name = "Recruiter",
                    NormalizedName = "RECRUITER"
                },
                new IdentityRole<long>
                {
                    Id = 3,
                    Name = "Candidate",
                    NormalizedName = "CANDIDATE"
                }
            );
        }
    }
}
