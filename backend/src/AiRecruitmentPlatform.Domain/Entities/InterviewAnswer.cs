using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class InterviewAnswer : OrderableBaseEntity
    {
        public long InterviewQuestionId { get; set; }
        public string CandidateResponseText { get; set; } = string.Empty;
        public string? MediaUrl { get; set; }
        public int DepthScore { get; set; } // 0-100
        public int CorrectnessScore { get; set; } // 0-100
        public int SoftSkillScore { get; set; } // 0-100
        public int OverallScore { get; set; } // 0-100
        public string? AiFeedbackText { get; set; }
        public string? StrengthsJson { get; set; }
        public string? WeaknessesJson { get; set; }
        public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public InterviewQuestion? InterviewQuestion { get; set; }
    }
}
