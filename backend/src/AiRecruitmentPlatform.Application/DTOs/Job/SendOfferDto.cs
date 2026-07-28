using System;

namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class SendOfferDto
    {
        public long ApplicationId { get; set; }
        public decimal? OfferedSalary { get; set; }
        public string? Currency { get; set; }
        public string? SalaryPeriod { get; set; }
        public DateTime? ProposedStartDate { get; set; }
        public int? ExpiresInDays { get; set; } = 14;
        public string? RecruiterNotes { get; set; }
    }
}
