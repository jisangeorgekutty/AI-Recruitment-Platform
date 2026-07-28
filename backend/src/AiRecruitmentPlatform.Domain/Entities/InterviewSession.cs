using System;
using System.Collections.Generic;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class InterviewSession : OrderableBaseEntity
    {
        public long JobApplicationId { get; set; }
        public long JobPostingId { get; set; }
        public long CandidateProfileId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string InterviewType { get; set; } = "ai_screening"; // ai_screening, technical, behavioral
        public string Status { get; set; } = "scheduled"; // scheduled, in_progress, completed, cancelled
        public DateTime ScheduledAt { get; set; } = DateTime.UtcNow;
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int DurationMinutes { get; set; } = 30;

        // Navigation Properties
        public JobApplication? JobApplication { get; set; }
        public JobPosting? JobPosting { get; set; }
        public CandidateProfileInformation? CandidateProfile { get; set; }
        public ICollection<InterviewQuestion> Questions { get; set; } = new List<InterviewQuestion>();
        public InterviewScorecard? Scorecard { get; set; }
    }
}
