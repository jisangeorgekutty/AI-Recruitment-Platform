using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class JobScreeningQuestion : OrderableBaseEntity
    {
        public long JobPostingId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string QuestionType { get; set; } = "YesNo"; // YesNo, MultipleChoice, Text
        public string? OptionsJson { get; set; } // JSON array string for multiple choice options
        public string? IdealAnswer { get; set; }
        public bool IsKnockout { get; set; } = false;

        // Navigation Property
        public JobPosting JobPosting { get; set; } = null!;
    }
}
