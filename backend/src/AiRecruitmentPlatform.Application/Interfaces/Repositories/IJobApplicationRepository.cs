using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IJobApplicationRepository : IRepository<JobApplication>
    {
        Task<JobApplication?> GetByIdWithDetailsAsync(long id);
        Task<IEnumerable<JobApplication>> GetCandidateApplicationsAsync(long candidateProfileId);
        Task<IEnumerable<JobApplication>> GetJobApplicationsAsync(long jobPostingId);
        Task<bool> HasCandidateAppliedAsync(long candidateProfileId, long jobPostingId);
    }
}
