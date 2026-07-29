using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface ICompanySubscriptionRepository : IRepository<CompanySubscription>
    {
        Task<CompanySubscription?> GetByCompanyProfileIdAsync(long companyProfileId);
        Task<CompanySubscription?> GetByStripeSubscriptionIdAsync(string stripeSubscriptionId);
    }
}
