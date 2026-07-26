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
    public class RecruiterParsedResumeRepository : GenericRepository<RecruiterParsedResume>, IRecruiterParsedResumeRepository
    {
        private readonly ApplicationDbContext _context;

        public RecruiterParsedResumeRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<IEnumerable<RecruiterParsedResume>> GetByCompanyIdAsync(long companyProfileId)
        {
            return await _context.RecruiterParsedResumes
                .Where(r => r.CompanyProfileId == companyProfileId && !r.IsDeleted)
                .OrderByDescending(r => r.ParsedAt)
                .ToListAsync();
        }

        public async Task<RecruiterParsedResume?> GetByIdAndCompanyAsync(long id, long companyProfileId)
        {
            return await _context.RecruiterParsedResumes
                .Where(r => r.Id == id && r.CompanyProfileId == companyProfileId && !r.IsDeleted)
                .FirstOrDefaultAsync();
        }
    }
}
