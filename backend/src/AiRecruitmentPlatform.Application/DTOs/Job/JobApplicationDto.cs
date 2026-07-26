using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class JobApplicationDto
    {
        public long Id { get; set; }
        public long JobPostingId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyLogoUrl { get; set; }
        public string Location { get; set; } = string.Empty;
        public long CandidateProfileId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public string? CandidatePhone { get; set; }
        public long? CandidateResumeId { get; set; }
        public string? ResumeUrl { get; set; }
        public string? CoverLetter { get; set; }
        public string Status { get; set; } = "Applied";
        public DateTime AppliedDate { get; set; }
        public List<JobApplicationAnswerDto> Answers { get; set; } = new List<JobApplicationAnswerDto>();
    }
}
