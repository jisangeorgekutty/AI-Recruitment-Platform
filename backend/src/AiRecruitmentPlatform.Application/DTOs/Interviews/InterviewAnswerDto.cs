using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Interviews
{
    public class InterviewAnswerDto
    {
        public long Id { get; set; }
        public long InterviewQuestionId { get; set; }
        public string CandidateResponseText { get; set; } = string.Empty;
        public string? MediaUrl { get; set; }
        public int DepthScore { get; set; }
        public int CorrectnessScore { get; set; }
        public int SoftSkillScore { get; set; }
        public int OverallScore { get; set; }
        public string? AiFeedbackText { get; set; }
        public List<string> Strengths { get; set; } = new List<string>();
        public List<string> Weaknesses { get; set; } = new List<string>();
        public DateTime EvaluatedAt { get; set; }
    }
}
