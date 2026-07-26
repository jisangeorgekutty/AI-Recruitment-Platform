namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class JobScreeningQuestionDto
    {
        public long Id { get; set; }
        public long JobPostingId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string QuestionType { get; set; } = "YesNo";
        public string? OptionsJson { get; set; }
        public string? IdealAnswer { get; set; }
        public bool IsKnockout { get; set; } = false;
        public long DisplayOrder { get; set; }
    }
}
