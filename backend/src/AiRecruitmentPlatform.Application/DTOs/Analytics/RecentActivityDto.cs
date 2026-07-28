using System;

namespace AiRecruitmentPlatform.Application.DTOs.Analytics
{
    public class RecentActivityDto
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? UserAvatar { get; set; }
        public string Timestamp { get; set; } = string.Empty;
    }
}
