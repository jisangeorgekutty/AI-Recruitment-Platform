namespace AiRecruitmentPlatform.Application.DTOs.Analytics
{
    public class SourceBreakdownDto
    {
        public string Source { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
