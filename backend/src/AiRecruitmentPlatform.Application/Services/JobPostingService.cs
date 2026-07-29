using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Job;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;

namespace AiRecruitmentPlatform.Application.Services
{
    public class JobPostingService : IJobPostingService
    {
        private readonly IJobPostingRepository _jobRepo;
        private readonly ICompanyProfileRepository _companyRepo;
        private readonly IRepository<JobSkill> _skillRepo;
        private readonly IRepository<JobScreeningQuestion> _questionRepo;
        private readonly IAuditLogService _auditLogService;
        private readonly IMapper _mapper;

        public JobPostingService(
            IJobPostingRepository jobRepo,
            ICompanyProfileRepository companyRepo,
            IRepository<JobSkill> skillRepo,
            IRepository<JobScreeningQuestion> questionRepo,
            IAuditLogService auditLogService,
            IMapper mapper)
        {
            _jobRepo = jobRepo;
            _companyRepo = companyRepo;
            _skillRepo = skillRepo;
            _questionRepo = questionRepo;
            _auditLogService = auditLogService;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<JobPostingDto>> GetJobsAsync(JobFilterDto filter)
        {
            var result = await _jobRepo.GetFilteredJobsAsync(filter);
            var mappedItems = _mapper.Map<List<JobPostingDto>>(result.Items);

            return new PaginatedResponse<JobPostingDto>
            {
                Items = mappedItems,
                Page = result.Page,
                PageSize = result.PageSize,
                TotalCount = result.TotalCount,
                TotalPages = result.TotalPages,
                HasNextPage = result.HasNextPage,
                HasPreviousPage = result.HasPreviousPage
            };
        }

        public async Task<JobPostingDto?> GetJobByIdAsync(long id)
        {
            var job = await _jobRepo.GetJobPostingWithDetailsAsync(id);
            if (job == null) return null;

            // Increment views count on read
            job.ViewsCount += 1;
            await _jobRepo.Update(job);
            await _jobRepo.SaveChanges();

            return _mapper.Map<JobPostingDto>(job);
        }

        public async Task<JobPostingDto> CreateJobAsync(long userId, CreateJobPostingDto dto)
        {
            var company = await EnsureCompanyProfileAsync(userId);

            var job = _mapper.Map<JobPosting>(dto);
            job.CompanyProfileId = company.Id;
            job.CreatedOn = DateTime.UtcNow;
            job.ModifiedOn = DateTime.UtcNow;
            job.CreatedBy = userId.ToString();

            // Set timestamps and display order for mapped child entities
            if (job.Skills != null && job.Skills.Any())
            {
                long order = 1;
                foreach (var skill in job.Skills)
                {
                    skill.DisplayOrder = order++;
                    skill.CreatedOn = DateTime.UtcNow;
                    skill.ModifiedOn = DateTime.UtcNow;
                }
            }

            if (job.ScreeningQuestions != null && job.ScreeningQuestions.Any())
            {
                long order = 1;
                foreach (var q in job.ScreeningQuestions)
                {
                    q.DisplayOrder = order++;
                    q.CreatedOn = DateTime.UtcNow;
                    q.ModifiedOn = DateTime.UtcNow;
                }
            }

            // EF Core will save the job and its child collections in a single SaveChanges call
            await _jobRepo.Add(job);
            await _jobRepo.SaveChanges();

            await _auditLogService.LogAsync(userId, company.ContactEmail ?? $"user_{userId}@platform.local", "Job Posting Created", $"Job: {job.Title} (ID: {job.Id})", "info");

            return (await GetJobByIdAsync(job.Id))!;
        }

        public async Task<JobPostingDto> UpdateJobAsync(long id, long userId, UpdateJobPostingDto dto)
        {
            var job = await _jobRepo.GetJobPostingWithDetailsAsync(id)
                ?? throw new KeyNotFoundException("Job posting not found.");

            var company = await EnsureCompanyProfileAsync(userId);
            if (job.CompanyProfileId != company.Id)
            {
                throw new UnauthorizedAccessException("You are not authorized to edit this job posting.");
            }

            job.Title = dto.Title;
            job.Department = dto.Department;
            job.Location = dto.Location;
            job.RemoteType = dto.RemoteType;
            job.EmploymentType = dto.EmploymentType;
            job.ExperienceLevel = dto.ExperienceLevel;
            job.Description = dto.Description;
            job.Requirements = dto.Requirements;
            job.Responsibilities = dto.Responsibilities;
            job.SalaryMin = dto.SalaryMin;
            job.SalaryMax = dto.SalaryMax;
            job.Currency = dto.Currency;
            job.ShowSalary = dto.ShowSalary;
            job.HiringManager = dto.HiringManager;
            job.Status = dto.Status;
            job.ModifiedOn = DateTime.UtcNow;
            job.ModifiedBy = userId.ToString();

            // Synchronize Skills
            var existingSkills = await _skillRepo.Where(s => s.JobPostingId == id && !s.IsDeleted);
            foreach (var s in existingSkills)
            {
                await _skillRepo.SoftDelete(s);
            }

            if (dto.Skills != null && dto.Skills.Any())
            {
                long order = 1;
                foreach (var skillDto in dto.Skills)
                {
                    var skill = _mapper.Map<JobSkill>(skillDto);
                    skill.Id = 0; // ensure new entity
                    skill.JobPostingId = job.Id;
                    skill.DisplayOrder = order++;
                    skill.CreatedOn = DateTime.UtcNow;
                    skill.ModifiedOn = DateTime.UtcNow;
                    await _skillRepo.Add(skill);
                }
            }

            // Synchronize Questions
            var existingQuestions = await _questionRepo.Where(q => q.JobPostingId == id && !q.IsDeleted);
            foreach (var q in existingQuestions)
            {
                await _questionRepo.SoftDelete(q);
            }

            if (dto.ScreeningQuestions != null && dto.ScreeningQuestions.Any())
            {
                long order = 1;
                foreach (var qDto in dto.ScreeningQuestions)
                {
                    var q = _mapper.Map<JobScreeningQuestion>(qDto);
                    q.Id = 0; // ensure new entity
                    q.JobPostingId = job.Id;
                    q.DisplayOrder = order++;
                    q.CreatedOn = DateTime.UtcNow;
                    q.ModifiedOn = DateTime.UtcNow;
                    await _questionRepo.Add(q);
                }
            }

            await _jobRepo.Update(job);
            await _jobRepo.SaveChanges();

            return (await GetJobByIdAsync(job.Id))!;
        }

        public async Task<bool> DeleteJobAsync(long id, long userId)
        {
            var job = await _jobRepo.Get(id);
            if (job == null) return false;

            var company = await EnsureCompanyProfileAsync(userId);
            if (job.CompanyProfileId != company.Id)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this job posting.");
            }

            await _jobRepo.SoftDelete(job);
            await _jobRepo.SaveChanges();
            return true;
        }

        public async Task<JobPostingDto> UpdateJobStatusAsync(long id, long userId, string status)
        {
            var job = await _jobRepo.Get(id)
                ?? throw new KeyNotFoundException("Job posting not found.");

            var company = await EnsureCompanyProfileAsync(userId);
            if (job.CompanyProfileId != company.Id)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this job posting.");
            }

            job.Status = status;
            job.ModifiedOn = DateTime.UtcNow;
            job.ModifiedBy = userId.ToString();

            await _jobRepo.Update(job);
            await _jobRepo.SaveChanges();

            return (await GetJobByIdAsync(job.Id))!;
        }

        public async Task<JobPostingDto> DuplicateJobAsync(long id, long userId)
        {
            var sourceJob = await _jobRepo.GetJobPostingWithDetailsAsync(id)
                ?? throw new KeyNotFoundException("Job posting not found.");

            var company = await EnsureCompanyProfileAsync(userId);
            if (sourceJob.CompanyProfileId != company.Id)
            {
                throw new UnauthorizedAccessException("You are not authorized to duplicate this job posting.");
            }

            var newJob = new JobPosting
            {
                CompanyProfileId = company.Id,
                Title = $"{sourceJob.Title} (Copy)",
                Department = sourceJob.Department,
                Location = sourceJob.Location,
                RemoteType = sourceJob.RemoteType,
                EmploymentType = sourceJob.EmploymentType,
                ExperienceLevel = sourceJob.ExperienceLevel,
                Description = sourceJob.Description,
                Requirements = sourceJob.Requirements,
                Responsibilities = sourceJob.Responsibilities,
                SalaryMin = sourceJob.SalaryMin,
                SalaryMax = sourceJob.SalaryMax,
                Currency = sourceJob.Currency,
                ShowSalary = sourceJob.ShowSalary,
                HiringManager = sourceJob.HiringManager,
                Status = "Draft",
                ViewsCount = 0,
                ApplicationsCount = 0,
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow,
                CreatedBy = userId.ToString()
            };

            await _jobRepo.Add(newJob);
            await _jobRepo.SaveChanges();

            if (sourceJob.Skills != null)
            {
                foreach (var s in sourceJob.Skills)
                {
                    await _skillRepo.Add(new JobSkill
                    {
                        JobPostingId = newJob.Id,
                        SkillName = s.SkillName,
                        IsMandatory = s.IsMandatory,
                        MinimumYearsExperience = s.MinimumYearsExperience,
                        DisplayOrder = s.DisplayOrder,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow
                    });
                }
            }

            if (sourceJob.ScreeningQuestions != null)
            {
                foreach (var q in sourceJob.ScreeningQuestions)
                {
                    await _questionRepo.Add(new JobScreeningQuestion
                    {
                        JobPostingId = newJob.Id,
                        QuestionText = q.QuestionText,
                        QuestionType = q.QuestionType,
                        OptionsJson = q.OptionsJson,
                        IdealAnswer = q.IdealAnswer,
                        IsKnockout = q.IsKnockout,
                        DisplayOrder = q.DisplayOrder,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow
                    });
                }
            }

            await _jobRepo.SaveChanges();

            return (await GetJobByIdAsync(newJob.Id))!;
        }

        public async Task<JobStatsDto> GetJobStatsAsync(long userId)
        {
            var company = await EnsureCompanyProfileAsync(userId);
            return await _jobRepo.GetJobStatsAsync(company.Id);
        }

        private async Task<CompanyProfile> EnsureCompanyProfileAsync(long userId)
        {
            var company = await _companyRepo.GetByUserIdAsync(userId);
            if (company == null)
            {
                company = new CompanyProfile
                {
                    UserId = userId,
                    CompanyName = "My Company",
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow
                };
                await _companyRepo.Add(company);
                await _companyRepo.SaveChanges();
            }
            return company;
        }
    }
}
