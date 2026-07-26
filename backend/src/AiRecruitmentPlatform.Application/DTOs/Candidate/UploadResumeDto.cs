using Microsoft.AspNetCore.Http;

namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class UploadResumeDto
    {
        public IFormFile File { get; set; } = null!;
        public bool IsPrimary { get; set; } = false;
    }
}
