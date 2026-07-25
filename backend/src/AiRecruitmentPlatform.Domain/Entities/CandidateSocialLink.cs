using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class CandidateSocialLink : BaseEntity
    {
        public long CandidateProfileInformationId { get; set; }
        public string? GitHubUrl { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? WebsiteUrl { get; set; }

        // Navigation Property
        public CandidateProfileInformation ProfileInformation { get; set; } = null!;
    }
}
