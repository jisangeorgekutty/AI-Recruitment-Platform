using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class CandidateResumeAnalysis : OrderableBaseEntity
    {
        public long CandidateResumeId { get; set; }
        public long CandidateProfileId { get; set; }
        public int OverallScore { get; set; }
        public int KeywordMatchScore { get; set; }
        public int FormatCompatibilityScore { get; set; }
        public int SectionCompletenessScore { get; set; }
        public string SuggestionsJson { get; set; } = "[]";
        public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public CandidateResume CandidateResume { get; set; } = null!;
        public CandidateProfileInformation CandidateProfile { get; set; } = null!;
    }
}
