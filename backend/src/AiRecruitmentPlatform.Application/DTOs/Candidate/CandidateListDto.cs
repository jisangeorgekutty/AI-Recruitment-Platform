using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class CandidateListDto
    {
        public string Id { get; set; } = string.Empty;
        public long ApplicationId { get; set; }
        public long CandidateProfileId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public string? Position { get; set; }
        public string? Location { get; set; }
        public string Stage { get; set; } = "applied";
        public string Status { get; set; } = "active";
        public List<string> Skills { get; set; } = new List<string>();
        public List<CandidateExperienceDto> Experience { get; set; } = new List<CandidateExperienceDto>();
        public List<CandidateEducationDto> Education { get; set; } = new List<CandidateEducationDto>();
        public int Rating { get; set; } = 4;
        public string? ResumeUrl { get; set; }
        public int? ResumeScore { get; set; }
        public long JobPostingId { get; set; }
        public string? JobTitle { get; set; }
        public int? MatchScoreOverall { get; set; }
        public int? MatchScoreSkill { get; set; }
        public int? MatchScoreExperience { get; set; }
        public string? RecommendationFit { get; set; }
        public List<string> MatchedSkills { get; set; } = new List<string>();
        public List<string> MissingSkills { get; set; } = new List<string>();
        public string? CandidateAiSummary { get; set; }
        public int? InterviewOverallScore { get; set; }
        public string? InterviewRecommendation { get; set; }
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
    }
}
