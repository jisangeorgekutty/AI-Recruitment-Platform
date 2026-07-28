using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Notification;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface INotificationService
    {
        Task<NotificationDto> CreateAndSendNotificationAsync(CreateNotificationDto dto);
        Task<(IReadOnlyList<NotificationDto> Data, int Total, int UnreadCount)> GetUserNotificationsAsync(long userId, int page, int pageSize);
        Task<bool> MarkAsReadAsync(long userId, long notificationId);
        Task<bool> MarkAllAsReadAsync(long userId);
        Task<bool> DeleteNotificationAsync(long userId, long notificationId);
        Task<int> GetUnreadCountAsync(long userId);
    }
}
