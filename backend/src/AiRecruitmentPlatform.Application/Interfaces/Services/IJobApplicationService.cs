using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Job;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IJobApplicationService
    {
        Task<JobApplicationDto> ApplyForJobAsync(long userId, ApplyJobDto applyDto);
        Task<IEnumerable<JobApplicationDto>> GetMyApplicationsAsync(long userId);
        Task<JobApplicationDto?> GetApplicationByIdAsync(long userId, long applicationId);
        Task<bool> WithdrawApplicationAsync(long userId, long applicationId);
        Task<IEnumerable<JobApplicationDto>> GetApplicationsForJobAsync(long recruiterUserId, long jobId);
        Task<bool> UpdateApplicationStatusAsync(long recruiterUserId, long applicationId, string newStatus);
    }
}
