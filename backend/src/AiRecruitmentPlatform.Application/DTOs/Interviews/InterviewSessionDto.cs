using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Interviews
{
    public class InterviewSessionDto
    {
        public long Id { get; set; }
        public long JobApplicationId { get; set; }
        public long JobPostingId { get; set; }
        public long CandidateProfileId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string InterviewType { get; set; } = "ai_screening";
        public string Status { get; set; } = "scheduled";
        public DateTime ScheduledAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int DurationMinutes { get; set; }
        public List<InterviewQuestionDto> Questions { get; set; } = new List<InterviewQuestionDto>();
        public InterviewScorecardDto? Scorecard { get; set; }
    }
}
