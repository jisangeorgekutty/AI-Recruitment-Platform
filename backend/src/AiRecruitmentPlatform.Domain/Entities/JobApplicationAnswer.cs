using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class JobApplicationAnswer : OrderableBaseEntity
    {
        public long JobApplicationId { get; set; }
        public long JobScreeningQuestionId { get; set; }
        public string AnswerText { get; set; } = string.Empty;

        // Navigation Properties
        public JobApplication JobApplication { get; set; } = null!;
        public JobScreeningQuestion JobScreeningQuestion { get; set; } = null!;
    }
}
