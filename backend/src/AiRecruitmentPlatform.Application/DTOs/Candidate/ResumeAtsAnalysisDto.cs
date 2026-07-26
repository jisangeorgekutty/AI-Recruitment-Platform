using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class ResumeAtsAnalysisDto
    {
        public long Id { get; set; }
        public long CandidateResumeId { get; set; }
        public long CandidateProfileId { get; set; }
        public int OverallScore { get; set; }
        public int KeywordMatchScore { get; set; }
        public int FormatCompatibilityScore { get; set; }
        public int SectionCompletenessScore { get; set; }
        public List<ResumeAtsSuggestionDto> Suggestions { get; set; } = new List<ResumeAtsSuggestionDto>();
        public DateTime AnalyzedAt { get; set; }
    }
}
