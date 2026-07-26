using System;
using System.Collections.Generic;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class JobPosting : OrderableBaseEntity
    {
        public long CompanyProfileId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string RemoteType { get; set; } = "OnSite"; // OnSite, Remote, Hybrid
        public string EmploymentType { get; set; } = "FullTime"; // FullTime, PartTime, Contract, Internship
        public string ExperienceLevel { get; set; } = "Mid"; // Entry, Mid, Senior, Lead, Executive
        public string Description { get; set; } = string.Empty;
        public string? Requirements { get; set; }
        public string? Responsibilities { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string Currency { get; set; } = "USD";
        public bool ShowSalary { get; set; } = true;
        public string? HiringManager { get; set; }
        public string Status { get; set; } = "Draft"; // Draft, Active, Paused, Closed, Archived
        public int ViewsCount { get; set; } = 0;
        public int ApplicationsCount { get; set; } = 0;

        // Navigation Properties
        public CompanyProfile CompanyProfile { get; set; } = null!;
        public ICollection<JobSkill> Skills { get; set; } = new List<JobSkill>();
        public ICollection<JobScreeningQuestion> ScreeningQuestions { get; set; } = new List<JobScreeningQuestion>();
    }
}
