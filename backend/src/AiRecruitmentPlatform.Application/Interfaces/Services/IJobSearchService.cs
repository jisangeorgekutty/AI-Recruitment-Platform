using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Job;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IJobSearchService
    {
        Task<PaginatedResponse<JobPostingDto>> SearchJobsAsync(JobFilterDto filter);
        Task<JobPostingDto?> GetJobDetailsAsync(long jobId, long? currentCandidateUserId = null);
    }
}
