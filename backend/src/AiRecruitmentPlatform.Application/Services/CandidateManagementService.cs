using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;

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
        private readonly IMapper _mapper;
        private readonly IJobOfferRepository _jobOfferRepository;

        public CandidateManagementService(
            IJobApplicationRepository jobApplicationRepository,
            IJobPostingRepository jobPostingRepository,
            ICandidateProfileRepository candidateProfileRepository,
            ICompanyProfileRepository companyProfileRepository,
            IJobApplicationMatchScoreRepository matchScoreRepository,
            IIdentityService identityService,
            IMapper mapper,
            IJobOfferRepository jobOfferRepository)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _jobPostingRepository = jobPostingRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _companyProfileRepository = companyProfileRepository;
            _matchScoreRepository = matchScoreRepository;
            _identityService = identityService;
            _mapper = mapper;
            _jobOfferRepository = jobOfferRepository;
        }

        public async Task<PaginatedResponse<CandidateListDto>> GetCandidatesAsync(
            long recruiterUserId, string? search, string? stage, string? status, int page, int pageSize)
        {
            var company = await _companyProfileRepository.GetByUserIdAsync(recruiterUserId);

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

            var pipelineStages = new[] { "sourced", "applied", "screened", "shortlisted", "interview", "technical", "offer", "hired", "rejected" };
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

        public async Task<List<CandidateListDto>> GetCandidatesByIdsAsync(long recruiterUserId, List<long> applicationIds)
        {
            if (applicationIds == null || applicationIds.Count == 0)
                return new List<CandidateListDto>();

            var applications = await _jobApplicationRepository.GetByIdsWithDetailsAsync(applicationIds);
            var results = new List<CandidateListDto>();

            foreach (var app in applications)
            {
                var dto = await MapToCandidateListDto(app);
                if (dto != null)
                {
                    results.Add(dto);
                }
            }

            return results;
        }

        public async Task<bool> UpdateCandidateStageAsync(long recruiterUserId, long applicationId, string stage)
        {
            var application = await _jobApplicationRepository.GetByIdWithDetailsAsync(applicationId);
            if (application == null) return false;

            var mappedStatus = MapStageToStatus(stage);
            application.Status = mappedStatus;
            await _jobApplicationRepository.Update(application);

            if (mappedStatus.Equals("Offered", StringComparison.OrdinalIgnoreCase))
            {
                await EnsureJobOfferExistsAsync(application);
            }

            await _jobApplicationRepository.SaveChanges();
            return true;
        }

        public async Task<bool> BatchUpdateCandidateStagesAsync(long recruiterUserId, List<BatchStageUpdateDto> updates)
        {
            if (updates == null || updates.Count == 0) return true;

            foreach (var update in updates)
            {
                var application = await _jobApplicationRepository.GetByIdWithDetailsAsync(update.ApplicationId);
                if (application != null)
                {
                    var mappedStatus = MapStageToStatus(update.Stage);
                    application.Status = mappedStatus;
                    await _jobApplicationRepository.Update(application);

                    if (mappedStatus.Equals("Offered", StringComparison.OrdinalIgnoreCase))
                    {
                        await EnsureJobOfferExistsAsync(application);
                    }
                }
            }

            await _jobApplicationRepository.SaveChanges();
            return true;
        }

        private async Task EnsureJobOfferExistsAsync(JobApplication application)
        {
            var existingOffer = await _jobOfferRepository.GetByApplicationIdAsync(application.Id);
            if (existingOffer == null)
            {
                decimal salary = application.JobPosting?.SalaryMax ?? application.JobPosting?.SalaryMin ?? 100000m;
                string currency = application.JobPosting?.Currency ?? "USD";

                var newOffer = new JobOffer
                {
                    JobApplicationId = application.Id,
                    OfferedSalary = salary,
                    Currency = currency,
                    SalaryPeriod = "yearly",
                    OfferedDate = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddDays(14),
                    Status = "Pending"
                };
                await _jobOfferRepository.Add(newOffer);
            }
        }

        private async Task<CandidateListDto?> MapToCandidateListDto(JobApplication app)
        {
            var profile = app.CandidateProfile ?? await _candidateProfileRepository.GetFullProfileByIdAsync(app.CandidateProfileId);
            if (profile == null) return null;

            var dto = _mapper.Map<CandidateListDto>(app);

            var userBasic = await _identityService.GetUserBasicInfoAsync(profile.UserId);
            dto.Name = userBasic.HasValue ? $"{userBasic.Value.FirstName} {userBasic.Value.LastName}".Trim() : "Applicant";
            dto.Email = userBasic.HasValue ? userBasic.Value.Email : string.Empty;
            dto.Phone = userBasic.HasValue ? userBasic.Value.Phone : string.Empty;
            dto.Avatar = userBasic.HasValue ? userBasic.Value.AvatarUrl : null;
            dto.Position = profile.CurrentTitle ?? profile.TargetRole ?? "Job Applicant";
            dto.Location = profile.Location;
            dto.Stage = MapStatusToStage(app.Status);
            dto.Status = (app.Status.Equals("Withdrawn", StringComparison.OrdinalIgnoreCase) || app.Status.Equals("Rejected", StringComparison.OrdinalIgnoreCase)) ? "inactive" : "active";

            if (profile.Skills != null)
            {
                dto.Skills = profile.Skills.Select(s => s.Name).ToList();
            }

            if (profile.Experiences != null)
            {
                dto.Experience = _mapper.Map<List<CandidateExperienceDto>>(profile.Experiences);
            }

            if (profile.Educations != null)
            {
                dto.Education = _mapper.Map<List<CandidateEducationDto>>(profile.Educations);
            }

            // Populate match score details if present
            var matchScore = app.MatchScore ?? await _matchScoreRepository.GetByApplicationIdAsync(app.Id);
            if (matchScore != null)
            {
                dto.MatchScoreOverall = matchScore.OverallMatchPercentage;
                dto.MatchScoreSkill = matchScore.SkillMatchPercentage;
                dto.MatchScoreExperience = matchScore.ExperienceMatchPercentage;
                dto.ResumeScore = matchScore.OverallMatchPercentage;
                dto.RecommendationFit = matchScore.RecommendationFit;
                dto.CandidateAiSummary = matchScore.CandidateAiSummary;

                try
                {
                    if (!string.IsNullOrEmpty(matchScore.MatchedSkillsJson))
                        dto.MatchedSkills = JsonSerializer.Deserialize<List<string>>(matchScore.MatchedSkillsJson) ?? new List<string>();
                    if (!string.IsNullOrEmpty(matchScore.MissingSkillsJson))
                        dto.MissingSkills = JsonSerializer.Deserialize<List<string>>(matchScore.MissingSkillsJson) ?? new List<string>();
                }
                catch { }
            }

            return dto;
        }

        private static string MapStatusToStage(string status)
        {
            return status?.ToLowerInvariant() switch
            {
                "applied" => "applied",
                "screening" or "screened" or "ai screened" => "screened",
                "shortlisted" => "shortlisted",
                "interviewing" or "interview" or "interview scheduled" => "interview",
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
                "screened" or "ai screened" or "ai_screened" => "Screening",
                "shortlisted" => "Shortlisted",
                "interview" or "interview scheduled" or "interview_scheduled" => "Interviewing",
                "technical" => "Interviewing",
                "offer" or "offered" => "Offered",
                "hired" => "Hired",
                "rejected" => "Rejected",
                _ => "Applied"
            };
        }
    }
}
