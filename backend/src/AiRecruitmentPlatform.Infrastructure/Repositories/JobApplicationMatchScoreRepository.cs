using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class JobApplicationMatchScoreRepository : GenericRepository<JobApplicationMatchScore>, IJobApplicationMatchScoreRepository
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationMatchScoreRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<JobApplicationMatchScore?> GetByApplicationIdAsync(long applicationId)
        {
            return await _context.JobApplicationMatchScores
                .Where(ms => ms.JobApplicationId == applicationId && !ms.IsDeleted)
                .OrderByDescending(ms => ms.EvaluatedAt)
                .FirstOrDefaultAsync();
        }
    }
}
