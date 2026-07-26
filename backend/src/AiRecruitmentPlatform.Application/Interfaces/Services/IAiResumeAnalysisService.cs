using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IAiResumeAnalysisService
    {
        Task<ResumeAtsAnalysisDto> AnalyzeResumeAsync(long userId, long resumeId);
        Task<ResumeAtsAnalysisDto?> GetLatestAnalysisAsync(long userId, long resumeId);
    }
}
