using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IAuditLogRepository : IRepository<AuditLog>
    {
        Task<IReadOnlyList<AuditLog>> GetFilteredLogsAsync(string? search, string? severity, int page, int pageSize);
    }
}
