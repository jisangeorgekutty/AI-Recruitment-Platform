using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class CandidateLanguage : BaseEntity
    {
        public long CandidateProfileInformationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Proficiency { get; set; } // e.g. Native, Fluent, Professional, Basic

        // Navigation Property
        public CandidateProfileInformation ProfileInformation { get; set; } = null!;
    }
}
