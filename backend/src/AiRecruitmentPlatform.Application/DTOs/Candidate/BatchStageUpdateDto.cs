namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class BatchStageUpdateDto
    {
        public long ApplicationId { get; set; }
        public string Stage { get; set; } = string.Empty;
    }
}
