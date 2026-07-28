using System;

namespace AiRecruitmentPlatform.Application.DTOs.Admin
{
    public class AuditLogDto
    {
        public long Id { get; set; }
        public long? UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string Severity { get; set; } = "info";
        public string? Details { get; set; }
        public string? IpAddress { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
