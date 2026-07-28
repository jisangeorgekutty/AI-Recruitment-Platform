using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class Notification : BaseEntity
    {
        public long UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "System"; // ApplicationStatus, InterviewInvite, NewMatch, System
        public string? LinkUrl { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime? ReadAt { get; set; }
    }
}
