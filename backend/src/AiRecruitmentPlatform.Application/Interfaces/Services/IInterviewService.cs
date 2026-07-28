using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Interviews;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IInterviewService
    {
        Task<InterviewSessionDto> CreateSessionAsync(CreateInterviewSessionRequest request, string currentUserId);
        Task<InterviewSessionDto?> GetSessionByIdAsync(long id);
        Task<IEnumerable<InterviewSessionDto>> GetCandidateSessionsAsync(string currentUserId);
        Task<IEnumerable<InterviewSessionDto>> GetRecruiterSessionsAsync(string currentUserId, long? jobId = null);
        Task<InterviewSessionDto> StartSessionAsync(long id);
        Task<InterviewSessionDto> CancelSessionAsync(long id);
        Task<InterviewQuestionDto> SubmitAnswerAsync(long sessionId, SubmitInterviewAnswerRequest request);
        Task<InterviewScorecardDto> GenerateScorecardAsync(long sessionId);
    }
}
