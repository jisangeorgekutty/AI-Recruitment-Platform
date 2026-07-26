using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class RecruiterParsedResume : OrderableBaseEntity
    {
        public long CompanyProfileId { get; set; }
        public long RecruiterUserId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public string? CandidatePhone { get; set; }
        public string? CurrentTitle { get; set; }
        public string? Location { get; set; }
        public int YearsOfExperience { get; set; }
        public string? Summary { get; set; }
        public string SkillsJson { get; set; } = "[]";
        public string WorkHistoryJson { get; set; } = "[]";
        public string EducationJson { get; set; } = "[]";
        public int AtsOverallScore { get; set; }
        public int AtsKeywordScore { get; set; }
        public int AtsFormatScore { get; set; }
        public int AtsCompletenessScore { get; set; }
        public string AtsSuggestionsJson { get; set; } = "[]";
        public string OriginalFileName { get; set; } = string.Empty;
        public string? DocumentUrl { get; set; }
        public DateTime ParsedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public CompanyProfile CompanyProfile { get; set; } = null!;
    }
}
