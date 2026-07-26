namespace AiRecruitmentPlatform.Infrastructure.Configuration
{
    public class GeminiSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string Model { get; set; } = "gemini-flash-latest";
    }
}
