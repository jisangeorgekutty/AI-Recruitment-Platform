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
    public class InterviewRepository : GenericRepository<InterviewSession>, IInterviewRepository
    {
        private readonly ApplicationDbContext _context;

        public InterviewRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<InterviewSession?> GetByIdWithDetailsAsync(long id)
        {
            return await _context.InterviewSessions
                .Include(s => s.JobPosting)
                    .ThenInclude(j => j.CompanyProfile)
                .Include(s => s.CandidateProfile)
                    .ThenInclude(c => c.Skills)
                .Include(s => s.JobApplication)
                .Include(s => s.Questions)
                    .ThenInclude(q => q.Answer)
                .Include(s => s.Scorecard)
                .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
        }

        public async Task<IEnumerable<InterviewSession>> GetAllWithDetailsAsync()
        {
            return await _context.InterviewSessions
                .Include(s => s.JobPosting)
                    .ThenInclude(j => j.CompanyProfile)
                .Include(s => s.CandidateProfile)
                .Include(s => s.Questions)
                    .ThenInclude(q => q.Answer)
                .Include(s => s.Scorecard)
                .Where(s => !s.IsDeleted)
                .OrderByDescending(s => s.ScheduledAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<InterviewSession>> GetByCandidateProfileIdAsync(long candidateProfileId)
        {
            return await _context.InterviewSessions
                .Include(s => s.JobPosting)
                    .ThenInclude(j => j.CompanyProfile)
                .Include(s => s.CandidateProfile)
                .Include(s => s.Questions)
                    .ThenInclude(q => q.Answer)
                .Include(s => s.Scorecard)
                .Where(s => s.CandidateProfileId == candidateProfileId && !s.IsDeleted)
                .OrderByDescending(s => s.ScheduledAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<InterviewSession>> GetByJobPostingIdAsync(long jobPostingId)
        {
            return await _context.InterviewSessions
                .Include(s => s.JobPosting)
                    .ThenInclude(j => j.CompanyProfile)
                .Include(s => s.CandidateProfile)
                .Include(s => s.Questions)
                    .ThenInclude(q => q.Answer)
                .Include(s => s.Scorecard)
                .Where(s => s.JobPostingId == jobPostingId && !s.IsDeleted)
                .OrderByDescending(s => s.ScheduledAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<InterviewSession>> GetByApplicationIdAsync(long applicationId)
        {
            return await _context.InterviewSessions
                .Include(s => s.JobPosting)
                    .ThenInclude(j => j.CompanyProfile)
                .Include(s => s.CandidateProfile)
                .Include(s => s.Questions)
                    .ThenInclude(q => q.Answer)
                .Include(s => s.Scorecard)
                .Where(s => s.JobApplicationId == applicationId && !s.IsDeleted)
                .OrderByDescending(s => s.ScheduledAt)
                .ToListAsync();
        }
    }
}
