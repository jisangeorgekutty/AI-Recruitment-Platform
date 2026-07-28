using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public NotificationRepository(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor)
            : base(dbContext, httpContextAccessor)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<Notification>> GetUserNotificationsAsync(long userId, int page, int pageSize)
        {
            return await _dbContext.Set<Notification>()
                .Where(n => !n.IsDeleted && n.UserId == userId)
                .OrderByDescending(n => n.CreatedOn)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetUnreadCountAsync(long userId)
        {
            return await _dbContext.Set<Notification>()
                .CountAsync(n => !n.IsDeleted && n.UserId == userId && !n.IsRead);
        }

        public async Task MarkAllAsReadAsync(long userId)
        {
            var unread = await _dbContext.Set<Notification>()
                .Where(n => !n.IsDeleted && n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var n in unread)
            {
                n.IsRead = true;
                n.ReadAt = System.DateTime.UtcNow;
            }

            await _dbContext.SaveChangesAsync();
        }
    }
}
