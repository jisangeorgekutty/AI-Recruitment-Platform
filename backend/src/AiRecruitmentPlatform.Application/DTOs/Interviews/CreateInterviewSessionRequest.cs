using System;

namespace AiRecruitmentPlatform.Application.DTOs.Interviews
{
    public class CreateInterviewSessionRequest
    {
        public long JobApplicationId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string InterviewType { get; set; } = "ai_screening";
        public DateTime ScheduledAt { get; set; } = DateTime.UtcNow;
        public int DurationMinutes { get; set; } = 30;
    }
}
