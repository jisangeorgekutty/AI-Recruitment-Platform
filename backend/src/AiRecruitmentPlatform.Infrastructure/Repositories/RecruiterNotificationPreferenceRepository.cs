using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class RecruiterNotificationPreferenceRepository : GenericRepository<RecruiterNotificationPreference>, IRecruiterNotificationPreferenceRepository
    {
        private readonly ApplicationDbContext _context;

        public RecruiterNotificationPreferenceRepository(ApplicationDbContext context, Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<RecruiterNotificationPreference?> GetByUserIdAsync(long userId)
        {
            return await _context.RecruiterNotificationPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId && !p.IsDeleted);
        }
    }
}

