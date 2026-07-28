namespace AiRecruitmentPlatform.Application.DTOs.Interviews
{
    public class GenerateInterviewQuestionsRequest
    {
        public long InterviewSessionId { get; set; }
        public int QuestionCount { get; set; } = 5;
    }
}
