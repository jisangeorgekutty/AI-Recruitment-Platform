using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.DTOs.Common;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface ICandidateManagementService
    {
        Task<PaginatedResponse<CandidateListDto>> GetCandidatesAsync(long recruiterUserId, string? search, string? stage, string? status, int page, int pageSize);
        Task<Dictionary<string, List<CandidateListDto>>> GetCandidatePipelineAsync(long recruiterUserId, long? jobId);
        Task<CandidateListDto?> GetCandidateByIdAsync(long recruiterUserId, long applicationId);
        Task<bool> UpdateCandidateStageAsync(long recruiterUserId, long applicationId, string stage);
    }
}
