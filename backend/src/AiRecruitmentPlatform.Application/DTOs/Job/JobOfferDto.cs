using System;

namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class JobOfferDto
    {
        public long Id { get; set; }
        public long JobApplicationId { get; set; }
        public long JobPostingId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyLogoUrl { get; set; }
        public string Location { get; set; } = string.Empty;
        public decimal OfferedSalary { get; set; }
        public string Currency { get; set; } = "USD";
        public string SalaryPeriod { get; set; } = "yearly";
        public DateTime? ProposedStartDate { get; set; }
        public DateTime OfferedDate { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string Status { get; set; } = "Pending";
        public string? RecruiterNotes { get; set; }
        public DateTime? RespondedDate { get; set; }
    }
}
