using AiRecruitmentPlatform.Domain.Entities.Common;
using AiRecruitmentPlatform.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Infrastructure.Identity.Models;
using AiRecruitmentPlatform.Infrastructure.Persistence.Configurations;

namespace AiRecruitmentPlatform.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<long>, long>
    {
        public DbSet<CandidateProfileInformation> CandidateProfileInformations { get; set; } = null!;
        public DbSet<CandidateSocialLink> CandidateSocialLinks { get; set; } = null!;
        public DbSet<CandidateExperience> CandidateExperiences { get; set; } = null!;
        public DbSet<CandidateEducation> CandidateEducations { get; set; } = null!;
        public DbSet<CandidateSkill> CandidateSkills { get; set; } = null!;
        public DbSet<CandidateLanguage> CandidateLanguages { get; set; } = null!;
        public DbSet<RecruiterNotificationPreference> RecruiterNotificationPreferences { get; set; } = null!;
        public DbSet<CompanyProfile> CompanyProfiles { get; set; } = null!;
        public DbSet<JobPosting> JobPostings { get; set; } = null!;
        public DbSet<JobSkill> JobSkills { get; set; } = null!;
        public DbSet<JobScreeningQuestion> JobScreeningQuestions { get; set; } = null!;
        public DbSet<JobApplication> JobApplications { get; set; } = null!;
        public DbSet<JobApplicationAnswer> JobApplicationAnswers { get; set; } = null!;
        public DbSet<CandidateResume> CandidateResumes { get; set; } = null!;
        public DbSet<CandidateSavedJob> CandidateSavedJobs { get; set; } = null!;
        public DbSet<CandidateResumeAnalysis> CandidateResumeAnalyses { get; set; } = null!;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new RoleConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new UserRoleConfiguration());
            modelBuilder.ApplyConfiguration(new RoleClaimConfiguration());


            // Convert names to snake case

            modelBuilder.Entity<ApplicationUser>().ToTable("users");
            modelBuilder.Entity<IdentityRole<long>>().ToTable("roles");
            modelBuilder.Entity<IdentityUserToken<long>>().ToTable("user_tokens");
            modelBuilder.Entity<IdentityUserRole<long>>().ToTable("user_roles");
            modelBuilder.Entity<IdentityRoleClaim<long>>().ToTable("role_claims");
            modelBuilder.Entity<IdentityUserClaim<long>>().ToTable("user_claims");
            modelBuilder.Entity<IdentityUserLogin<long>>().ToTable("user_logins");

        }

        public virtual async Task<int> SaveChangesAsync(string username = "SYSTEM")
        {
            foreach (var entry in base.ChangeTracker.Entries<BaseEntity>()
                         .Where(q => q.State is EntityState.Added or EntityState.Modified))
            {
                entry.Entity.ModifiedOn = DateTime.UtcNow;
                entry.Entity.ModifiedBy = username;


                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedOn = DateTime.UtcNow;
                    entry.Entity.CreatedBy = username;
                }
            }

            var result = await base.SaveChangesAsync();

            return result;
        }
    }
}
