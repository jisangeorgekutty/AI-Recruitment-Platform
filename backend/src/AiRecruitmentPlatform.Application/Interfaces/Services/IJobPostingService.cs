using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Job;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IJobPostingService
    {
        Task<PaginatedResponse<JobPostingDto>> GetJobsAsync(JobFilterDto filter);
        Task<JobPostingDto?> GetJobByIdAsync(long id);
        Task<JobPostingDto> CreateJobAsync(long userId, CreateJobPostingDto dto);
        Task<JobPostingDto> UpdateJobAsync(long id, long userId, UpdateJobPostingDto dto);
        Task<bool> DeleteJobAsync(long id, long userId);
        Task<JobPostingDto> UpdateJobStatusAsync(long id, long userId, string status);
        Task<JobPostingDto> DuplicateJobAsync(long id, long userId);
        Task<JobStatsDto> GetJobStatsAsync(long userId);
    }
}
