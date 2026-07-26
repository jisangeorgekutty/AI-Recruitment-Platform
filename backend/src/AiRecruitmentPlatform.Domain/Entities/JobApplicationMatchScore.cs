using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class JobApplicationMatchScore : OrderableBaseEntity
    {
        public long JobApplicationId { get; set; }
        public int OverallMatchPercentage { get; set; }
        public int SkillMatchPercentage { get; set; }
        public int ExperienceMatchPercentage { get; set; }
        public string MatchedSkillsJson { get; set; } = "[]";
        public string MissingSkillsJson { get; set; } = "[]";
        public string CandidateAiSummary { get; set; } = string.Empty;
        public string RecommendationFit { get; set; } = "Potential Fit"; // Strong Fit, Potential Fit, Low Fit
        public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public JobApplication JobApplication { get; set; } = null!;
    }
}
