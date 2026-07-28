using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Interviews
{
    public class InterviewScorecardDto
    {
        public long Id { get; set; }
        public long InterviewSessionId { get; set; }
        public int OverallScore { get; set; }
        public string Recommendation { get; set; } = "Consider";
        public int TechnicalScore { get; set; }
        public int SoftSkillScore { get; set; }
        public int ProblemSolvingScore { get; set; }
        public string ExecutiveSummary { get; set; } = string.Empty;
        public List<string> KeyStrengths { get; set; } = new List<string>();
        public List<string> KeyWeaknesses { get; set; } = new List<string>();
        public List<string> RedFlags { get; set; } = new List<string>();
        public DateTime GeneratedAt { get; set; }
    }
}
