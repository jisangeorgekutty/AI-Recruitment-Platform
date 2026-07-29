using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IPaymentTransactionRepository : IRepository<PaymentTransaction>
    {
        Task<PaymentTransaction?> GetByStripeSessionIdAsync(string stripeSessionId);
        Task<IEnumerable<PaymentTransaction>> GetByCompanyProfileIdAsync(long companyProfileId);
    }
}
