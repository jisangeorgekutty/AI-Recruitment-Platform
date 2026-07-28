using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class JobOffer : BaseEntity
    {
        public long JobApplicationId { get; set; }
        public decimal OfferedSalary { get; set; }
        public string Currency { get; set; } = "USD";
        public string SalaryPeriod { get; set; } = "yearly"; // yearly, monthly, hourly
        public DateTime? ProposedStartDate { get; set; }
        public DateTime OfferedDate { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(14);
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Declined, Expired
        public string? RecruiterNotes { get; set; }
        public DateTime? RespondedDate { get; set; }

        // Navigation Property
        public JobApplication JobApplication { get; set; } = null!;
    }
}
