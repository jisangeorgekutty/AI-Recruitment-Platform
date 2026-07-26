using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IRecruiterNotificationPreferenceRepository : IRepository<RecruiterNotificationPreference>
    {
        Task<RecruiterNotificationPreference?> GetByUserIdAsync(long userId);
    }
}
