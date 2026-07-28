namespace AiRecruitmentPlatform.Application.DTOs.Interviews
{
    public class SubmitInterviewAnswerRequest
    {
        public long InterviewQuestionId { get; set; }
        public string CandidateResponseText { get; set; } = string.Empty;
        public string? MediaUrl { get; set; }
    }
}
