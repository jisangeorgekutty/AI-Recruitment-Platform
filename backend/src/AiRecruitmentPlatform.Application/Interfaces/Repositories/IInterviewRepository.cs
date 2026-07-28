using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IInterviewRepository : IRepository<InterviewSession>
    {
        Task<InterviewSession?> GetByIdWithDetailsAsync(long id);
        Task<IEnumerable<InterviewSession>> GetAllWithDetailsAsync();
        Task<IEnumerable<InterviewSession>> GetByCandidateProfileIdAsync(long candidateProfileId);
        Task<IEnumerable<InterviewSession>> GetByJobPostingIdAsync(long jobPostingId);
        Task<IEnumerable<InterviewSession>> GetByApplicationIdAsync(long applicationId);
    }
}
