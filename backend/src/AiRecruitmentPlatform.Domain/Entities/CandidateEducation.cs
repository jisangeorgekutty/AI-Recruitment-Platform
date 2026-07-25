using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class CandidateEducation : BaseEntity
    {
        public long CandidateProfileInformationId { get; set; }
        public string Institution { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Grade { get; set; }
        public string? Description { get; set; }

        // Navigation Property
        public CandidateProfileInformation ProfileInformation { get; set; } = null!;
    }
}
