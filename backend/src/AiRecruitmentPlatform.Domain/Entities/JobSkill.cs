using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class JobSkill : OrderableBaseEntity
    {
        public long JobPostingId { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public bool IsMandatory { get; set; } = true;
        public int MinimumYearsExperience { get; set; } = 0;

        // Navigation Property
        public JobPosting JobPosting { get; set; } = null!;
    }
}
