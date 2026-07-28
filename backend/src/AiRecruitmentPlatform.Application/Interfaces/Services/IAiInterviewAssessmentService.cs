using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Interviews;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IAiInterviewAssessmentService
    {
        Task<List<InterviewQuestion>> GenerateDynamicQuestionsAsync(JobPosting jobPosting, CandidateProfileInformation candidateProfile, int count = 5);
        Task<InterviewAnswer> EvaluateAnswerAsync(InterviewQuestion question, string candidateResponseText, string? mediaUrl);
        Task<InterviewScorecard> GenerateScorecardAsync(InterviewSession session);
    }
}
