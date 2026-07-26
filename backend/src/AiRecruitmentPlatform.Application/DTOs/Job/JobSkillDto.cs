namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class JobSkillDto
    {
        public long Id { get; set; }
        public long JobPostingId { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public bool IsMandatory { get; set; } = true;
        public int MinimumYearsExperience { get; set; } = 0;
        public long DisplayOrder { get; set; }
    }
}
