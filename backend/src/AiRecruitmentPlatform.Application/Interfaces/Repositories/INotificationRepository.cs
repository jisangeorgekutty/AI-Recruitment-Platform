using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface INotificationRepository : IRepository<Notification>
    {
        Task<IReadOnlyList<Notification>> GetUserNotificationsAsync(long userId, int page, int pageSize);
        Task<int> GetUnreadCountAsync(long userId);
        Task MarkAllAsReadAsync(long userId);
    }
}
