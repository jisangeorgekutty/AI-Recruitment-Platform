using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface ICandidateResumeAnalysisRepository : IRepository<CandidateResumeAnalysis>
    {
        Task<CandidateResumeAnalysis?> GetByResumeIdAsync(long resumeId);
    }
}
