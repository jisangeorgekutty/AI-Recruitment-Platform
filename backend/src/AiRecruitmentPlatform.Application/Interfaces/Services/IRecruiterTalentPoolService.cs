using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Recruiter;
using Microsoft.AspNetCore.Http;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IRecruiterTalentPoolService
    {
        Task<RecruiterParsedResumeDto> ParseAndSaveResumeAsync(long recruiterUserId, IFormFile file);
        Task<PaginatedResponse<RecruiterParsedResumeDto>> GetTalentPoolResumesAsync(long recruiterUserId, string? search, int page, int pageSize);
        Task<RecruiterParsedResumeDto?> GetTalentResumeByIdAsync(long recruiterUserId, long id);
        Task<bool> DeleteTalentResumeAsync(long recruiterUserId, long id);
    }
}
