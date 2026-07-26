using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface ICandidateResumeRepository : IRepository<CandidateResume>
    {
        Task<IEnumerable<CandidateResume>> GetByCandidateIdAsync(long candidateProfileId);
        Task<CandidateResume?> GetPrimaryResumeAsync(long candidateProfileId);
        Task SetPrimaryResumeAsync(long candidateProfileId, long resumeId);
    }
}
