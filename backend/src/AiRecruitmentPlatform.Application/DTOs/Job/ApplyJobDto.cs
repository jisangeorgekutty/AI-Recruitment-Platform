using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class ApplyJobDto
    {
        public long JobPostingId { get; set; }
        public long? CandidateResumeId { get; set; }
        public IFormFile? CustomResumeFile { get; set; }
        public string? CoverLetter { get; set; }
        public List<JobApplicationAnswerDto> Answers { get; set; } = new List<JobApplicationAnswerDto>();
    }
}
