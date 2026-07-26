namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class JobFilterDto
    {
        public string? Search { get; set; }
        public string? Status { get; set; }
        public string? Department { get; set; }
        public string? RemoteType { get; set; }
        public string? EmploymentType { get; set; }
        public string? ExperienceLevel { get; set; }
        public long? CompanyProfileId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
