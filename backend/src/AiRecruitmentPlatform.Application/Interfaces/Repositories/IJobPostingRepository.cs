using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Job;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IJobPostingRepository : IRepository<JobPosting>
    {
        Task<JobPosting?> GetJobPostingWithDetailsAsync(long id);
        Task<PaginatedResponse<JobPosting>> GetFilteredJobsAsync(JobFilterDto filter);
        Task<JobStatsDto> GetJobStatsAsync(long? companyProfileId);
    }
}
