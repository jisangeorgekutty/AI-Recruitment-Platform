namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class JobApplicationAnswerDto
    {
        public long JobScreeningQuestionId { get; set; }
        public string AnswerText { get; set; } = string.Empty;
        public string? QuestionText { get; set; }
    }
}
