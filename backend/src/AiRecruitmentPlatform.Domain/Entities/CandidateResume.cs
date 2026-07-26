using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class CandidateResume : OrderableBaseEntity
    {
        public long CandidateProfileId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string? PublicId { get; set; }
        public string FileType { get; set; } = "PDF";
        public long FileSize { get; set; }
        public bool IsPrimary { get; set; } = false;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public CandidateProfileInformation CandidateProfile { get; set; } = null!;
    }
}
