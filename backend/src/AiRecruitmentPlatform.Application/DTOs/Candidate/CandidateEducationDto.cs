using System;

namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class CandidateEducationDto
    {
        public long Id { get; set; }
        public string Institution { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Grade { get; set; }
        public string? Description { get; set; }
    }
}
