using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Recruiter
{
    public class RecruiterParsedResumeDto
    {
        public long Id { get; set; }
        public long CompanyProfileId { get; set; }
        public long RecruiterUserId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public string? CandidatePhone { get; set; }
        public string? CurrentTitle { get; set; }
        public string? Location { get; set; }
        public int YearsOfExperience { get; set; }
        public string? Summary { get; set; }
        public List<string> Skills { get; set; } = new List<string>();
        public int AtsOverallScore { get; set; }
        public int AtsKeywordScore { get; set; }
        public int AtsFormatScore { get; set; }
        public int AtsCompletenessScore { get; set; }
        public List<string> AtsSuggestions { get; set; } = new List<string>();
        public string OriginalFileName { get; set; } = string.Empty;
        public string? DocumentUrl { get; set; }
        public DateTime ParsedAt { get; set; } = DateTime.UtcNow;
    }
}
