using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class CandidateSavedJob : OrderableBaseEntity
    {
        public long CandidateProfileId { get; set; }
        public long JobPostingId { get; set; }
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public CandidateProfileInformation CandidateProfile { get; set; } = null!;
        public JobPosting JobPosting { get; set; } = null!;
    }
}
