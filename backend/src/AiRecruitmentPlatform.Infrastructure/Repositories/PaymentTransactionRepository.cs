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
    public class PaymentTransactionRepository : GenericRepository<PaymentTransaction>, IPaymentTransactionRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentTransactionRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<PaymentTransaction?> GetByStripeSessionIdAsync(string stripeSessionId)
        {
            return await _context.PaymentTransactions
                .Include(pt => pt.SubscriptionPlan)
                .FirstOrDefaultAsync(pt => pt.StripeSessionId == stripeSessionId && !pt.IsDeleted);
        }

        public async Task<IEnumerable<PaymentTransaction>> GetByCompanyProfileIdAsync(long companyProfileId)
        {
            return await _context.PaymentTransactions
                .Include(pt => pt.SubscriptionPlan)
                .Where(pt => pt.CompanyProfileId == companyProfileId && !pt.IsDeleted)
                .OrderByDescending(pt => pt.CreatedOn)
                .ToListAsync();
        }
    }
}
