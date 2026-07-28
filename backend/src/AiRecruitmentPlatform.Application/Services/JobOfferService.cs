using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Job;
using AiRecruitmentPlatform.Application.DTOs.Notification;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;

namespace AiRecruitmentPlatform.Application.Services
{
    public class JobOfferService : IJobOfferService
    {
        private readonly IJobOfferRepository _jobOfferRepository;
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly ICandidateProfileRepository _candidateProfileRepository;
        private readonly ICompanyProfileRepository _companyProfileRepository;
        private readonly IIdentityService _identityService;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;

        public JobOfferService(
            IJobOfferRepository jobOfferRepository,
            IJobApplicationRepository jobApplicationRepository,
            IJobPostingRepository jobPostingRepository,
            ICandidateProfileRepository candidateProfileRepository,
            ICompanyProfileRepository companyProfileRepository,
            IIdentityService identityService,
            INotificationService notificationService,
            IMapper mapper)
        {
            _jobOfferRepository = jobOfferRepository;
            _jobApplicationRepository = jobApplicationRepository;
            _jobPostingRepository = jobPostingRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _companyProfileRepository = companyProfileRepository;
            _identityService = identityService;
            _notificationService = notificationService;
            _mapper = mapper;
        }

        public async Task<JobOfferDto> CreateOfferAsync(long recruiterUserId, SendOfferDto dto)
        {
            var application = await _jobApplicationRepository.GetByIdWithDetailsAsync(dto.ApplicationId);
            if (application == null || application.IsDeleted)
            {
                throw new KeyNotFoundException("Job application not found.");
            }

            var existingOffer = await _jobOfferRepository.GetByApplicationIdAsync(dto.ApplicationId);

            // Determine salary from dto or fallback to job posting
            decimal salary = dto.OfferedSalary ?? application.JobPosting.SalaryMax ?? application.JobPosting.SalaryMin ?? 100000m;
            string currency = !string.IsNullOrEmpty(dto.Currency) ? dto.Currency : (application.JobPosting.Currency ?? "USD");
            int expiresInDays = dto.ExpiresInDays ?? 14;

            JobOffer offer;
            if (existingOffer != null)
            {
                offer = existingOffer;
                offer.OfferedSalary = salary;
                offer.Currency = currency;
                offer.SalaryPeriod = dto.SalaryPeriod ?? offer.SalaryPeriod;
                offer.ProposedStartDate = dto.ProposedStartDate ?? offer.ProposedStartDate;
                offer.ExpiresAt = DateTime.UtcNow.AddDays(expiresInDays);
                offer.Status = "Pending";
                offer.RecruiterNotes = dto.RecruiterNotes ?? offer.RecruiterNotes;
                offer.OfferedDate = DateTime.UtcNow;
                await _jobOfferRepository.Update(offer);
            }
            else
            {
                offer = new JobOffer
                {
                    JobApplicationId = dto.ApplicationId,
                    OfferedSalary = salary,
                    Currency = currency,
                    SalaryPeriod = dto.SalaryPeriod ?? "yearly",
                    ProposedStartDate = dto.ProposedStartDate,
                    OfferedDate = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddDays(expiresInDays),
                    Status = "Pending",
                    RecruiterNotes = dto.RecruiterNotes
                };
                await _jobOfferRepository.Add(offer);
            }

            // Update JobApplication Status to "Offered"
            application.Status = "Offered";
            await _jobApplicationRepository.Update(application);
            await _jobOfferRepository.SaveChanges();

            // Trigger Notification to Candidate
            try
            {
                var candidateProfile = await _candidateProfileRepository.Get(application.CandidateProfileId);
                if (candidateProfile != null && candidateProfile.UserId > 0)
                {
                    var jobPosting = await _jobPostingRepository.Get(application.JobPostingId);
                    var jobTitle = jobPosting?.Title ?? "Job";
                    await _notificationService.CreateAndSendNotificationAsync(new CreateNotificationDto
                    {
                        UserId = candidateProfile.UserId,
                        Title = "Job Offer Received",
                        Message = $"You have received a job offer for {jobTitle}.",
                        Type = "JobOffer",
                        LinkUrl = "/candidate/offers"
                    });
                }
            }
            catch { }

            var updatedOffer = await _jobOfferRepository.GetByApplicationIdAsync(dto.ApplicationId);
            return _mapper.Map<JobOfferDto>(updatedOffer!);
        }

        public async Task<IEnumerable<JobOfferDto>> GetMyOffersAsync(long candidateUserId)
        {
            var profile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(candidateUserId);
            if (profile == null) return new List<JobOfferDto>();

            var offers = await _jobOfferRepository.GetOffersByCandidateProfileIdAsync(profile.Id);
            return _mapper.Map<List<JobOfferDto>>(offers);
        }

        public async Task<JobOfferDto?> GetOfferByApplicationIdAsync(long applicationId)
        {
            var offer = await _jobOfferRepository.GetByApplicationIdAsync(applicationId);
            if (offer == null) return null;

            return _mapper.Map<JobOfferDto>(offer);
        }

        public async Task<bool> RespondToOfferAsync(long candidateUserId, long applicationId, string response)
        {
            var profile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(candidateUserId);
            if (profile == null) return false;

            var offer = await _jobOfferRepository.GetByApplicationIdAsync(applicationId);
            if (offer == null || offer.JobApplication.CandidateProfileId != profile.Id) return false;

            var isAccepting = response.Equals("Accepted", StringComparison.OrdinalIgnoreCase);

            offer.Status = isAccepting ? "Accepted" : "Declined";
            offer.RespondedDate = DateTime.UtcNow;
            await _jobOfferRepository.Update(offer);

            // Update parent application status
            offer.JobApplication.Status = isAccepting ? "Hired" : "Rejected";
            await _jobApplicationRepository.Update(offer.JobApplication);

            await _jobOfferRepository.SaveChanges();

            // Trigger Notification to Recruiter
            try
            {
                var userBasic = await _identityService.GetUserBasicInfoAsync(profile.UserId);
                var candidateName = userBasic.HasValue ? $"{userBasic.Value.FirstName} {userBasic.Value.LastName}".Trim() : "A candidate";
                if (string.IsNullOrEmpty(candidateName)) candidateName = "A candidate";

                var jobPosting = await _jobPostingRepository.Get(offer.JobApplication.JobPostingId);
                if (jobPosting != null)
                {
                    long targetUserId = 0;
                    if (long.TryParse(jobPosting.CreatedBy, out var parsedId) && parsedId > 0)
                    {
                        targetUserId = parsedId;
                    }
                    else
                    {
                        var company = await _companyProfileRepository.Get(jobPosting.CompanyProfileId);
                        if (company != null && company.UserId > 0) targetUserId = company.UserId;
                    }

                    if (targetUserId > 0)
                    {
                        await _notificationService.CreateAndSendNotificationAsync(new CreateNotificationDto
                        {
                            UserId = targetUserId,
                            Title = $"Job Offer {(isAccepting ? "Accepted" : "Declined")}",
                            Message = $"{candidateName} has {(isAccepting ? "accepted" : "declined")} the job offer for {jobPosting.Title}.",
                            Type = "JobOffer",
                            LinkUrl = "/recruiter/candidates"
                        });
                    }
                }
            }
            catch { }

            return true;
        }
    }
}
