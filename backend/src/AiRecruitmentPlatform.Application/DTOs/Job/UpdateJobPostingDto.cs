using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class UpdateJobPostingDto
    {
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string RemoteType { get; set; } = "OnSite";
        public string EmploymentType { get; set; } = "FullTime";
        public string ExperienceLevel { get; set; } = "Mid";
        public string Description { get; set; } = string.Empty;
        public string? Requirements { get; set; }
        public string? Responsibilities { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string Currency { get; set; } = "USD";
        public bool ShowSalary { get; set; } = true;
        public string? HiringManager { get; set; }
        public string Status { get; set; } = "Draft";

        public List<JobSkillDto> Skills { get; set; } = new();
        public List<JobScreeningQuestionDto> ScreeningQuestions { get; set; } = new();
    }
}
