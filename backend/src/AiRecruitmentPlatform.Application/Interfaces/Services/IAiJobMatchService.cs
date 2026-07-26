using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Job;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IAiJobMatchService
    {
        Task<JobMatchResultDto> EvaluateApplicationMatchAsync(long recruiterUserId, long applicationId);
        Task<JobMatchResultDto?> GetApplicationMatchAsync(long recruiterUserId, long applicationId);
        Task<IEnumerable<JobMatchResultDto>> GetRankedMatchesForJobAsync(long recruiterUserId, long jobId);
    }
}
