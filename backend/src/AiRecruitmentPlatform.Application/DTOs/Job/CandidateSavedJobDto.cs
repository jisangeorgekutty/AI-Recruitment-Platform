using System;

namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class CandidateSavedJobDto
    {
        public long Id { get; set; }
        public long JobPostingId { get; set; }
        public JobPostingDto JobPosting { get; set; } = null!;
        public DateTime SavedAt { get; set; }
    }
}
