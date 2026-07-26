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
    public class CandidateSavedJobRepository : GenericRepository<CandidateSavedJob>, ICandidateSavedJobRepository
    {
        private readonly ApplicationDbContext _context;

        public CandidateSavedJobRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<IEnumerable<CandidateSavedJob>> GetByCandidateIdAsync(long candidateProfileId)
        {
            return await _context.CandidateSavedJobs
                .Include(s => s.JobPosting)
                    .ThenInclude(j => j.CompanyProfile)
                .Include(s => s.JobPosting)
                    .ThenInclude(j => j.Skills.Where(sk => !sk.IsDeleted))
                .Include(s => s.JobPosting)
                    .ThenInclude(j => j.ScreeningQuestions.Where(sq => !sq.IsDeleted))
                .Where(s => s.CandidateProfileId == candidateProfileId && !s.IsDeleted && !s.JobPosting.IsDeleted)
                .OrderByDescending(s => s.SavedAt)
                .ToListAsync();
        }

        public async Task<CandidateSavedJob?> GetSavedJobAsync(long candidateProfileId, long jobPostingId)
        {
            return await _context.CandidateSavedJobs
                .FirstOrDefaultAsync(s => s.CandidateProfileId == candidateProfileId && s.JobPostingId == jobPostingId && !s.IsDeleted);
        }

        public async Task<bool> IsJobSavedAsync(long candidateProfileId, long jobPostingId)
        {
            return await _context.CandidateSavedJobs
                .AnyAsync(s => s.CandidateProfileId == candidateProfileId && s.JobPostingId == jobPostingId && !s.IsDeleted);
        }
    }
}
