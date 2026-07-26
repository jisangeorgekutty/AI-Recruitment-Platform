using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Job;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AiRecruitmentPlatform.Infrastructure.Repositories
{
    public class JobPostingRepository : GenericRepository<JobPosting>, IJobPostingRepository
    {
        private readonly ApplicationDbContext _context;

        public JobPostingRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public async Task<JobPosting?> GetJobPostingWithDetailsAsync(long id)
        {
            return await _context.JobPostings
                .Include(j => j.CompanyProfile)
                .Include(j => j.Skills.Where(s => !s.IsDeleted).OrderBy(s => s.DisplayOrder))
                .Include(j => j.ScreeningQuestions.Where(q => !q.IsDeleted).OrderBy(q => q.DisplayOrder))
                .FirstOrDefaultAsync(j => j.Id == id && !j.IsDeleted);
        }

        public async Task<PaginatedResponse<JobPosting>> GetFilteredJobsAsync(JobFilterDto filter)
        {
            var query = _context.JobPostings
                .Include(j => j.CompanyProfile)
                .Include(j => j.Skills.Where(s => !s.IsDeleted))
                .Include(j => j.ScreeningQuestions.Where(q => !q.IsDeleted))
                .Where(j => !j.IsDeleted);

            if (filter.CompanyProfileId.HasValue && filter.CompanyProfileId > 0)
            {
                query = query.Where(j => j.CompanyProfileId == filter.CompanyProfileId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                query = query.Where(j => j.Status.ToLower() == filter.Status.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(filter.Department))
            {
                query = query.Where(j => j.Department.ToLower() == filter.Department.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(filter.RemoteType))
            {
                query = query.Where(j => j.RemoteType.ToLower() == filter.RemoteType.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(filter.EmploymentType))
            {
                query = query.Where(j => j.EmploymentType.ToLower() == filter.EmploymentType.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(filter.ExperienceLevel))
            {
                query = query.Where(j => j.ExperienceLevel.ToLower() == filter.ExperienceLevel.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.ToLower();
                query = query.Where(j =>
                    j.Title.ToLower().Contains(search) ||
                    j.Description.ToLower().Contains(search) ||
                    j.Department.ToLower().Contains(search) ||
                    j.Location.ToLower().Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(j => j.CreatedOn)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PaginatedResponse<JobPosting>
            {
                Items = items,
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize),
                HasNextPage = (filter.Page * filter.PageSize) < totalCount,
                HasPreviousPage = filter.Page > 1
            };
        }

        public async Task<JobStatsDto> GetJobStatsAsync(long? companyProfileId)
        {
            var query = _context.JobPostings.Where(j => !j.IsDeleted);
            if (companyProfileId.HasValue && companyProfileId > 0)
            {
                query = query.Where(j => j.CompanyProfileId == companyProfileId.Value);
            }

            var total = await query.CountAsync();
            var active = await query.CountAsync(j => j.Status == "Active" || j.Status == "published");
            var draft = await query.CountAsync(j => j.Status == "Draft" || j.Status == "draft");
            var paused = await query.CountAsync(j => j.Status == "Paused" || j.Status == "paused");
            var closed = await query.CountAsync(j => j.Status == "Closed" || j.Status == "closed");

            var deptStats = await query
                .GroupBy(j => j.Department)
                .Select(g => new JobDepartmentStatDto
                {
                    Department = string.IsNullOrWhiteSpace(g.Key) ? "General" : g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return new JobStatsDto
            {
                Total = total,
                Active = active,
                Draft = draft,
                Paused = paused,
                Closed = closed,
                ByDepartment = deptStats
            };
        }
    }
}
