using System;

namespace AiRecruitmentPlatform.Application.DTOs.Notification
{
    public class NotificationDto
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "System";
        public string? LinkUrl { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
