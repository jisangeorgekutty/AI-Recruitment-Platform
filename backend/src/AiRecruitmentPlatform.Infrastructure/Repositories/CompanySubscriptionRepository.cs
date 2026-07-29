using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class CompanySubscriptionRepository : GenericRepository<CompanySubscription>, ICompanySubscriptionRepository
    {
        private readonly ApplicationDbContext _context;

        public CompanySubscriptionRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<CompanySubscription?> GetByCompanyProfileIdAsync(long companyProfileId)
        {
            return await _context.CompanySubscriptions
                .Include(s => s.SubscriptionPlan)
                .Include(s => s.CompanyProfile)
                .FirstOrDefaultAsync(s => s.CompanyProfileId == companyProfileId && !s.IsDeleted);
        }

        public async Task<CompanySubscription?> GetByStripeSubscriptionIdAsync(string stripeSubscriptionId)
        {
            return await _context.CompanySubscriptions
                .Include(s => s.SubscriptionPlan)
                .Include(s => s.CompanyProfile)
                .FirstOrDefaultAsync(s => s.StripeSubscriptionId == stripeSubscriptionId && !s.IsDeleted);
        }
    }
}
