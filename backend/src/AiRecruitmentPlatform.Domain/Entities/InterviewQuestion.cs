using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class InterviewQuestion : OrderableBaseEntity
    {
        public long InterviewSessionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string Category { get; set; } = "Technical"; // Technical, SoftSkill, ProblemSolving, Behavioral
        public string DifficultyLevel { get; set; } = "medium"; // easy, medium, hard
        public string? ExpectedKeyPointsJson { get; set; }

        // Navigation Properties
        public InterviewSession? InterviewSession { get; set; }
        public InterviewAnswer? Answer { get; set; }
    }
}
