using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class CompanyProfileRepository : GenericRepository<CompanyProfile>, ICompanyProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public CompanyProfileRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<CompanyProfile?> GetByUserIdAsync(long userId)
        {
            return await _context.CompanyProfiles
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsDeleted);
        }
    }
}
