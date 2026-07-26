using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class RecruiterNotificationPreference : BaseEntity
    {
        public long UserId { get; set; }
        public bool EmailNotifications { get; set; } = true;
        public bool PushNotifications { get; set; } = true;
        public bool ApplicationUpdates { get; set; } = true;
        public bool InterviewReminders { get; set; } = true;
    }
}
