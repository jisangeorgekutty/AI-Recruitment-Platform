using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface ICandidateResumeService
    {
        Task<CandidateResumeDto> UploadResumeAsync(long userId, UploadResumeDto uploadDto);
        Task<IEnumerable<CandidateResumeDto>> GetMyResumesAsync(long userId);
        Task<bool> SetPrimaryResumeAsync(long userId, long resumeId);
        Task<bool> DeleteResumeAsync(long userId, long resumeId);
    }
}
