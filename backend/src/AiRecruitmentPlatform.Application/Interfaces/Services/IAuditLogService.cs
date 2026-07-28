using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Admin;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IAuditLogService
    {
        Task LogAsync(long? userId, string userEmail, string action, string target, string severity = "info", string? details = null, string? ipAddress = null);
        Task<IReadOnlyList<AuditLogDto>> GetLogsAsync(string? search, string? severity, int page = 1, int pageSize = 50);
    }
}
