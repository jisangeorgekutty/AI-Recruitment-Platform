using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class CandidateProfileDto
    {
        public long ProfileInformationId { get; set; }
        public long UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}".Trim();
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? AvatarUrl { get; set; }
        public string? CurrentTitle { get; set; }
        public string? Summary { get; set; }
        public string? Location { get; set; }
        public int YearsOfExperience { get; set; }
        public string? ResumeUrl { get; set; }

        public CandidateSocialLinksDto SocialLinks { get; set; } = new CandidateSocialLinksDto();
        public List<CandidateExperienceDto> Experiences { get; set; } = new List<CandidateExperienceDto>();
        public List<CandidateEducationDto> Educations { get; set; } = new List<CandidateEducationDto>();
        public List<CandidateSkillDto> Skills { get; set; } = new List<CandidateSkillDto>();
        public List<CandidateLanguageDto> Languages { get; set; } = new List<CandidateLanguageDto>();
    }
}
