using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class CandidateProfileRepository : GenericRepository<CandidateProfileInformation>, ICandidateProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public CandidateProfileRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<CandidateProfileInformation?> GetFullProfileByUserIdAsync(long userId)
        {
            return await _context.CandidateProfileInformations
                .Where(p => !p.IsDeleted && p.UserId == userId)
                .Include(p => p.SocialLinks)
                .Include(p => p.Experiences.Where(e => !e.IsDeleted))
                .Include(p => p.Educations.Where(e => !e.IsDeleted))
                .Include(p => p.Skills.Where(s => !s.IsDeleted))
                .Include(p => p.Languages.Where(l => !l.IsDeleted))
                .FirstOrDefaultAsync();
        }

        public async Task<CandidateProfileInformation?> GetFullProfileByIdAsync(long profileInfoId)
        {
            return await _context.CandidateProfileInformations
                .Where(p => !p.IsDeleted && p.Id == profileInfoId)
                .Include(p => p.SocialLinks)
                .Include(p => p.Experiences.Where(e => !e.IsDeleted))
                .Include(p => p.Educations.Where(e => !e.IsDeleted))
                .Include(p => p.Skills.Where(s => !s.IsDeleted))
                .Include(p => p.Languages.Where(l => !l.IsDeleted))
                .FirstOrDefaultAsync();
        }
    }
}
