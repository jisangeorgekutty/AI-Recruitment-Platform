using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface ICandidateSavedJobRepository : IRepository<CandidateSavedJob>
    {
        Task<IEnumerable<CandidateSavedJob>> GetByCandidateIdAsync(long candidateProfileId);
        Task<CandidateSavedJob?> GetSavedJobAsync(long candidateProfileId, long jobPostingId);
        Task<bool> IsJobSavedAsync(long candidateProfileId, long jobPostingId);
    }
}
