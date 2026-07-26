using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class JobMatchResultDto
    {
        public long Id { get; set; }
        public long JobApplicationId { get; set; }
        public long JobPostingId { get; set; }
        public long CandidateProfileId { get; set; }
        public int OverallMatchPercentage { get; set; }
        public int SkillMatchPercentage { get; set; }
        public int ExperienceMatchPercentage { get; set; }
        public List<string> MatchedSkills { get; set; } = new List<string>();
        public List<string> MissingSkills { get; set; } = new List<string>();
        public string CandidateAiSummary { get; set; } = string.Empty;
        public string RecommendationFit { get; set; } = "Potential Fit"; // Strong Fit, Potential Fit, Low Fit
        public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;
    }
}
