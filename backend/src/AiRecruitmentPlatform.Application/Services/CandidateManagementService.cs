using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Services
{
    public class CandidateManagementService : ICandidateManagementService
    {
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly ICandidateProfileRepository _candidateProfileRepository;
        private readonly ICompanyProfileRepository _companyProfileRepository;
        private readonly IJobApplicationMatchScoreRepository _matchScoreRepository;
        private readonly IIdentityService _identityService;

        public CandidateManagementService(
            IJobApplicationRepository jobApplicationRepository,
            IJobPostingRepository jobPostingRepository,
            ICandidateProfileRepository candidateProfileRepository,
            ICompanyProfileRepository companyProfileRepository,
            IJobApplicationMatchScoreRepository matchScoreRepository,
            IIdentityService identityService)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _jobPostingRepository = jobPostingRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _companyProfileRepository = companyProfileRepository;
            _matchScoreRepository = matchScoreRepository;
            _identityService = identityService;
        }

        public async Task<PaginatedResponse<CandidateListDto>> GetCandidatesAsync(
            long recruiterUserId, string? search, string? stage, string? status, int page, int pageSize)
        {
            var company = await _companyProfileRepository.GetByUserIdAsync(recruiterUserId);
            var recruiterJobIds = new HashSet<long>();

            if (company != null)
            {
                var companyJobs = await _jobPostingRepository.GetJobStatsAsync(company.Id);
                // Get all job applications for company jobs
            }

            var allApplications = await _jobApplicationRepository.GetAll();
            var candidateDtos = new List<CandidateListDto>();

            foreach (var app in allApplications.Where(a => !a.IsDeleted))
            {
                var dto = await MapToCandidateListDto(app);
                if (dto != null)
                {
                    candidateDtos.Add(dto);
                }
            }

            // Apply Filters
            var query = candidateDtos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLowerInvariant();
                query = query.Where(c => c.Name.ToLowerInvariant().Contains(s) ||
                                         c.Email.ToLowerInvariant().Contains(s) ||
                                         (c.Position != null && c.Position.ToLowerInvariant().Contains(s)));
            }

            if (!string.IsNullOrWhiteSpace(stage))
            {
                query = query.Where(c => c.Stage.Equals(stage, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(c => c.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
            }

            var totalCount = query.Count();
            var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return new PaginatedResponse<CandidateListDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages > 0 ? totalPages : 1,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };
        }

        public async Task<Dictionary<string, List<CandidateListDto>>> GetCandidatePipelineAsync(long recruiterUserId, long? jobId)
        {
            IEnumerable<JobApplication> applications;

            if (jobId.HasValue && jobId.Value > 0)
            {
                applications = await _jobApplicationRepository.GetJobApplicationsAsync(jobId.Value);
            }
            else
            {
                applications = (await _jobApplicationRepository.GetAll()).Where(a => !a.IsDeleted);
            }

            var list = new List<CandidateListDto>();
            foreach (var app in applications)
            {
                var dto = await MapToCandidateListDto(app);
                if (dto != null)
                {
                    list.Add(dto);
                }
            }

            var pipelineStages = new[] { "sourced", "applied", "screened", "interview", "technical", "offer", "hired", "rejected" };
            var result = pipelineStages.ToDictionary(s => s, s => new List<CandidateListDto>());

            foreach (var item in list)
            {
                var s = item.Stage.ToLowerInvariant();
                if (result.ContainsKey(s))
                {
                    result[s].Add(item);
                }
                else
                {
                    result["applied"].Add(item);
                }
            }

            return result;
        }

        public async Task<CandidateListDto?> GetCandidateByIdAsync(long recruiterUserId, long applicationId)
        {
            var application = await _jobApplicationRepository.GetByIdWithDetailsAsync(applicationId);
            if (application == null) return null;

            return await MapToCandidateListDto(application);
        }

        public async Task<bool> UpdateCandidateStageAsync(long recruiterUserId, long applicationId, string stage)
        {
            var application = await _jobApplicationRepository.Get(applicationId);
            if (application == null) return false;

            var mappedStatus = MapStageToStatus(stage);
            application.Status = mappedStatus;
            await _jobApplicationRepository.Update(application);
            await _jobApplicationRepository.SaveChanges();

            return true;
        }

        private async Task<CandidateListDto?> MapToCandidateListDto(JobApplication app)
        {
            var profile = await _candidateProfileRepository.GetFullProfileByIdAsync(app.CandidateProfileId);
            if (profile == null) return null;

            var userBasic = await _identityService.GetUserBasicInfoAsync(profile.UserId);
            var name = userBasic.HasValue ? $"{userBasic.Value.FirstName} {userBasic.Value.LastName}".Trim() : "Applicant";
            var email = userBasic.HasValue ? userBasic.Value.Email : string.Empty;
            var phone = userBasic.HasValue ? userBasic.Value.Phone : string.Empty;
            var avatar = userBasic.HasValue ? userBasic.Value.AvatarUrl : null;

            var skills = profile.Skills != null ? profile.Skills.Select(s => s.Name).ToList() : new List<string>();

            var experiences = profile.Experiences != null
                ? profile.Experiences.Select(e => new CandidateExperienceDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Company = e.Company,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCurrent = e.IsCurrent,
                    Description = e.Description
                }).ToList()
                : new List<CandidateExperienceDto>();

            var educations = profile.Educations != null
                ? profile.Educations.Select(e => new CandidateEducationDto
                {
                    Id = e.Id,
                    Institution = e.Institution,
                    Degree = e.Degree,
                    FieldOfStudy = e.FieldOfStudy,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCurrent = e.IsCurrent,
                    Grade = e.Grade,
                    Description = e.Description
                }).ToList()
                : new List<CandidateEducationDto>();

            // Get match score if available
            var matchScore = await _matchScoreRepository.GetByApplicationIdAsync(app.Id);
            int? resumeScore = matchScore?.OverallMatchPercentage;

            var stage = MapStatusToStage(app.Status);

            return new CandidateListDto
            {
                Id = app.Id.ToString(),
                ApplicationId = app.Id,
                CandidateProfileId = profile.Id,
                Name = name,
                Email = email,
                Phone = phone,
                Avatar = avatar,
                Position = profile.CurrentTitle ?? profile.TargetRole ?? "Job Applicant",
                Location = profile.Location,
                Stage = stage,
                Status = app.Status.Equals("Withdrawn", StringComparison.OrdinalIgnoreCase) || app.Status.Equals("Rejected", StringComparison.OrdinalIgnoreCase) ? "inactive" : "active",
                Skills = skills,
                Experience = experiences,
                Education = educations,
                Rating = 4,
                ResumeUrl = app.CustomResumeUrl,
                ResumeScore = resumeScore,
                AppliedDate = app.AppliedDate
            };
        }

        private static string MapStatusToStage(string status)
        {
            return status?.ToLowerInvariant() switch
            {
                "applied" => "applied",
                "screening" or "screened" => "screened",
                "interviewing" or "interview" => "interview",
                "technical" => "technical",
                "offered" or "offer" => "offer",
                "hired" => "hired",
                "rejected" => "rejected",
                _ => "applied"
            };
        }

        private static string MapStageToStatus(string stage)
        {
            return stage?.ToLowerInvariant() switch
            {
                "applied" => "Applied",
                "screened" => "Screening",
                "interview" => "Interviewing",
                "technical" => "Interviewing",
                "offer" => "Offered",
                "hired" => "Hired",
                "rejected" => "Rejected",
                _ => "Applied"
            };
        }
    }
}
