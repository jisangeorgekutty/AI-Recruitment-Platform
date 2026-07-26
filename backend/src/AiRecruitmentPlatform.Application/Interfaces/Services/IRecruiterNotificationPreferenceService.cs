using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Settings;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IRecruiterNotificationPreferenceService
    {
        Task<RecruiterNotificationPreferenceDto> GetPreferencesByUserIdAsync(long userId);
        Task<RecruiterNotificationPreferenceDto> UpdatePreferencesAsync(long userId, UpdateRecruiterNotificationPreferenceRequest request);
    }
}
