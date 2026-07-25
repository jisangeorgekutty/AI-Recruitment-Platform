using System;
using System.Collections.Generic;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class CandidateProfileInformation : BaseEntity
    {
        public long UserId { get; set; }
        public string? CurrentTitle { get; set; }
        public string? Summary { get; set; }
        public string? Location { get; set; }
        public int YearsOfExperience { get; set; }
        public string? ResumeUrl { get; set; }

        // Navigation Properties
        public CandidateSocialLink? SocialLinks { get; set; }
        public ICollection<CandidateExperience> Experiences { get; set; } = new List<CandidateExperience>();
        public ICollection<CandidateEducation> Educations { get; set; } = new List<CandidateEducation>();
        public ICollection<CandidateSkill> Skills { get; set; } = new List<CandidateSkill>();
        public ICollection<CandidateLanguage> Languages { get; set; } = new List<CandidateLanguage>();
    }
}
