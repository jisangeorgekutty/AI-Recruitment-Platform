using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Job;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface ICandidateSavedJobService
    {
        Task<bool> SaveJobAsync(long userId, long jobId);
        Task<bool> RemoveSavedJobAsync(long userId, long jobId);
        Task<IEnumerable<CandidateSavedJobDto>> GetMySavedJobsAsync(long userId);
        Task<bool> IsJobSavedAsync(long userId, long jobId);
    }
}
