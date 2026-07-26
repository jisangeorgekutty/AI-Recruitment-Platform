namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class ResumeAtsSuggestionDto
    {
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = "suggestion"; // improvement, warning, suggestion, success
    }
}
