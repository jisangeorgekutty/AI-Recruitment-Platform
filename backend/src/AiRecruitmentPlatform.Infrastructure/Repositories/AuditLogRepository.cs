using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class AuditLogRepository : GenericRepository<AuditLog>, IAuditLogRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public AuditLogRepository(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor)
            : base(dbContext, httpContextAccessor)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<AuditLog>> GetFilteredLogsAsync(string? search, string? severity, int page, int pageSize)
        {
            var query = _dbContext.Set<AuditLog>().Where(a => !a.IsDeleted);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(a => a.Action.ToLower().Contains(term) ||
                                         a.UserEmail.ToLower().Contains(term) ||
                                         a.Target.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(severity))
            {
                query = query.Where(a => a.Severity.ToLower() == severity.ToLower());
            }

            return await query.OrderByDescending(a => a.CreatedOn)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}
