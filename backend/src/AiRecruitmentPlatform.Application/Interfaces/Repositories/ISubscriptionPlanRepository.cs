using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface ISubscriptionPlanRepository : IRepository<SubscriptionPlan>
    {
        Task<IReadOnlyList<SubscriptionPlan>> GetOrderedPlansAsync();
    }
}
