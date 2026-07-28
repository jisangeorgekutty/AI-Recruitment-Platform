using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class InterviewScorecard : BaseEntity
    {
        public long InterviewSessionId { get; set; }
        public int OverallScore { get; set; } // 0-100
        public string Recommendation { get; set; } = "Consider"; // Strong Hire, Hire, Consider, Reject
        public int TechnicalScore { get; set; } // 0-100
        public int SoftSkillScore { get; set; } // 0-100
        public int ProblemSolvingScore { get; set; } // 0-100
        public string ExecutiveSummary { get; set; } = string.Empty;
        public string? KeyStrengthsJson { get; set; }
        public string? KeyWeaknessesJson { get; set; }
        public string? RedFlagsJson { get; set; }
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public InterviewSession? InterviewSession { get; set; }
    }
}
