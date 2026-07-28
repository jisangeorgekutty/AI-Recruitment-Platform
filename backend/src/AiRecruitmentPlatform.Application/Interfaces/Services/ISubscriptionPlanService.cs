using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Admin;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface ISubscriptionPlanService
    {
        Task<IReadOnlyList<SubscriptionPlanDto>> GetAllPlansAsync();
        Task<SubscriptionPlanDto?> GetPlanByIdAsync(long id);
        Task<SubscriptionPlanDto> CreatePlanAsync(CreateSubscriptionPlanDto dto);
        Task<SubscriptionPlanDto?> UpdatePlanAsync(long id, UpdateSubscriptionPlanDto dto);
        Task<bool> DeletePlanAsync(long id);
    }
}
