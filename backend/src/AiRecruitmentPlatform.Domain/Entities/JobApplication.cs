using System;
using System.Collections.Generic;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class JobApplication : OrderableBaseEntity
    {
        public long JobPostingId { get; set; }
        public long CandidateProfileId { get; set; }
        public long? CandidateResumeId { get; set; }
        public string? CustomResumeUrl { get; set; }
        public string? CoverLetter { get; set; }
        public string Status { get; set; } = "Applied"; // Applied, Screening, Shortlisted, Interviewing, Offered, Rejected, Withdrawn
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public JobPosting JobPosting { get; set; } = null!;
        public CandidateProfileInformation CandidateProfile { get; set; } = null!;
        public CandidateResume? CandidateResume { get; set; }
        public ICollection<JobApplicationAnswer> Answers { get; set; } = new List<JobApplicationAnswer>();
    }
}
