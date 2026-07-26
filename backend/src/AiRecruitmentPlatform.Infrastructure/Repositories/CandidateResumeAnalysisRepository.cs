using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class CandidateResumeAnalysisRepository : GenericRepository<CandidateResumeAnalysis>, ICandidateResumeAnalysisRepository
    {
        private readonly ApplicationDbContext _context;

        public CandidateResumeAnalysisRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<CandidateResumeAnalysis?> GetByResumeIdAsync(long resumeId)
        {
            return await _context.CandidateResumeAnalyses
                .Where(a => a.CandidateResumeId == resumeId && !a.IsDeleted)
                .OrderByDescending(a => a.AnalyzedAt)
                .FirstOrDefaultAsync();
        }
    }
}
