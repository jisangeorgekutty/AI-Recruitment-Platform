namespace AiRecruitmentPlatform.Application.DTOs.Settings
{
    public class UpdateRecruiterNotificationPreferenceRequest
    {
        public bool EmailNotifications { get; set; }
        public bool PushNotifications { get; set; }
        public bool ApplicationUpdates { get; set; }
        public bool InterviewReminders { get; set; }
    }
}
