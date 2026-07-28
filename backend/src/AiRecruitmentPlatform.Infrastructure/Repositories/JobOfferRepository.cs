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
    public class JobOfferRepository : GenericRepository<JobOffer>, IJobOfferRepository
    {
        private readonly ApplicationDbContext _context;

        public JobOfferRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<JobOffer?> GetByApplicationIdAsync(long applicationId)
        {
            return await _context.JobOffers
                .Include(o => o.JobApplication)
                    .ThenInclude(a => a.JobPosting)
                        .ThenInclude(j => j.CompanyProfile)
                .FirstOrDefaultAsync(o => o.JobApplicationId == applicationId && !o.IsDeleted);
        }

        public async Task<IEnumerable<JobOffer>> GetOffersByCandidateProfileIdAsync(long candidateProfileId)
        {
            return await _context.JobOffers
                .Include(o => o.JobApplication)
                    .ThenInclude(a => a.JobPosting)
                        .ThenInclude(j => j.CompanyProfile)
                .Where(o => o.JobApplication.CandidateProfileId == candidateProfileId && !o.IsDeleted)
                .OrderByDescending(o => o.OfferedDate)
                .ToListAsync();
        }
    }
}
