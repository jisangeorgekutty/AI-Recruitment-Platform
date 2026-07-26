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
    public class JobApplicationRepository : GenericRepository<JobApplication>, IJobApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<JobApplication?> GetByIdWithDetailsAsync(long id)
        {
            return await _context.JobApplications
                .Include(a => a.JobPosting)
                    .ThenInclude(j => j.CompanyProfile)
                .Include(a => a.CandidateProfile)
                .Include(a => a.CandidateResume)
                .Include(a => a.Answers)
                    .ThenInclude(ans => ans.JobScreeningQuestion)
                .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);
        }

        public async Task<IEnumerable<JobApplication>> GetCandidateApplicationsAsync(long candidateProfileId)
        {
            return await _context.JobApplications
                .Include(a => a.JobPosting)
                    .ThenInclude(j => j.CompanyProfile)
                .Include(a => a.CandidateResume)
                .Include(a => a.Answers)
                    .ThenInclude(ans => ans.JobScreeningQuestion)
                .Where(a => a.CandidateProfileId == candidateProfileId && !a.IsDeleted)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<JobApplication>> GetJobApplicationsAsync(long jobPostingId)
        {
            return await _context.JobApplications
                .Include(a => a.CandidateProfile)
                .Include(a => a.CandidateResume)
                .Include(a => a.Answers)
                    .ThenInclude(ans => ans.JobScreeningQuestion)
                .Where(a => a.JobPostingId == jobPostingId && !a.IsDeleted)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();
        }

        public async Task<bool> HasCandidateAppliedAsync(long candidateProfileId, long jobPostingId)
        {
            return await _context.JobApplications
                .AnyAsync(a => a.CandidateProfileId == candidateProfileId && a.JobPostingId == jobPostingId && !a.IsDeleted);
        }
    }
}
