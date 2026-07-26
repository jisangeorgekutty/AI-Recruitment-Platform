using System;

namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class CandidateResumeDto
    {
        public long Id { get; set; }
        public long CandidateProfileId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string? PublicId { get; set; }
        public string FileType { get; set; } = "PDF";
        public long FileSize { get; set; }
        public bool IsPrimary { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
