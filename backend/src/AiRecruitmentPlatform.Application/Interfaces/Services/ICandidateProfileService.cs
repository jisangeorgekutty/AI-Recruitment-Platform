using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using Microsoft.AspNetCore.Http;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface ICandidateProfileService
    {
        Task<CandidateProfileDto> GetProfileByUserIdAsync(long userId);
        Task<CandidateProfileDto> GetProfileByIdAsync(long profileInfoId);
        Task<CandidateProfileDto> UpdatePersonalInfoAsync(long userId, UpdateCandidatePersonalInfoRequest request);
        Task<CandidateProfileDto> UpdateSocialLinksAsync(long userId, UpdateCandidateSocialLinksRequest request);
        Task<CandidateExperienceDto> AddExperienceAsync(long userId, CandidateExperienceDto dto);
        Task<CandidateExperienceDto> UpdateExperienceAsync(long userId, long experienceId, CandidateExperienceDto dto);
        Task DeleteExperienceAsync(long userId, long experienceId);
        Task<CandidateEducationDto> AddEducationAsync(long userId, CandidateEducationDto dto);
        Task<CandidateEducationDto> UpdateEducationAsync(long userId, long educationId, CandidateEducationDto dto);
        Task DeleteEducationAsync(long userId, long educationId);
        Task<CandidateSkillDto> AddSkillAsync(long userId, CandidateSkillDto dto);
        Task DeleteSkillAsync(long userId, long skillId);
        Task<CandidateLanguageDto> AddLanguageAsync(long userId, CandidateLanguageDto dto);
        Task DeleteLanguageAsync(long userId, long languageId);
        Task<string?> UploadAvatarAsync(long userId, IFormFile imageFile);
        Task<string?> UploadResumeAsync(long userId, IFormFile resumeFile);
    }
}
