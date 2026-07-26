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
    public class CandidateResumeRepository : GenericRepository<CandidateResume>, ICandidateResumeRepository
    {
        private readonly ApplicationDbContext _context;

        public CandidateResumeRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<IEnumerable<CandidateResume>> GetByCandidateIdAsync(long candidateProfileId)
        {
            return await _context.CandidateResumes
                .Where(r => r.CandidateProfileId == candidateProfileId && !r.IsDeleted)
                .OrderByDescending(r => r.IsPrimary)
                .ThenByDescending(r => r.UploadedAt)
                .ToListAsync();
        }

        public async Task<CandidateResume?> GetPrimaryResumeAsync(long candidateProfileId)
        {
            return await _context.CandidateResumes
                .FirstOrDefaultAsync(r => r.CandidateProfileId == candidateProfileId && r.IsPrimary && !r.IsDeleted);
        }

        public async Task SetPrimaryResumeAsync(long candidateProfileId, long resumeId)
        {
            var resumes = await _context.CandidateResumes
                .Where(r => r.CandidateProfileId == candidateProfileId && !r.IsDeleted)
                .ToListAsync();

            foreach (var resume in resumes)
            {
                resume.IsPrimary = (resume.Id == resumeId);
            }

            await _context.SaveChangesAsync();
        }
    }
}
