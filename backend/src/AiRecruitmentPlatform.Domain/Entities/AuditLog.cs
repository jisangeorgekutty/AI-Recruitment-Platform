using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class AuditLog : BaseEntity
    {
        public long? UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string Severity { get; set; } = "info"; // info, medium, high, critical
        public string? Details { get; set; }
        public string? IpAddress { get; set; }
    }
}
