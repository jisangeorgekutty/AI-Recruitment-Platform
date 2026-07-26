namespace AiRecruitmentPlatform.Application.DTOs.Settings
{
    public class RecruiterNotificationPreferenceDto
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public bool EmailNotifications { get; set; }
        public bool PushNotifications { get; set; }
        public bool ApplicationUpdates { get; set; }
        public bool InterviewReminders { get; set; }
    }
}
