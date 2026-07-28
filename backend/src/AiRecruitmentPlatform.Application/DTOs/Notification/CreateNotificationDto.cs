namespace AiRecruitmentPlatform.Application.DTOs.Notification
{
    public class CreateNotificationDto
    {
        public long UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "System";
        public string? LinkUrl { get; set; }
    }
}
