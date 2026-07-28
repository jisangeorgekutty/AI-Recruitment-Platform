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
    public class SubscriptionPlanRepository : GenericRepository<SubscriptionPlan>, ISubscriptionPlanRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public SubscriptionPlanRepository(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor)
            : base(dbContext, httpContextAccessor)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<SubscriptionPlan>> GetOrderedPlansAsync()
        {
            return await _dbContext.Set<SubscriptionPlan>()
                .Where(p => !p.IsDeleted)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();
        }
    }
}
