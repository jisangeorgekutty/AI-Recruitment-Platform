using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Job;
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
        private readonly IMapper _mapper;

        public JobOfferService(
            IJobOfferRepository jobOfferRepository,
            IJobApplicationRepository jobApplicationRepository,
            IJobPostingRepository jobPostingRepository,
            ICandidateProfileRepository candidateProfileRepository,
            IMapper mapper)
        {
            _jobOfferRepository = jobOfferRepository;
            _jobApplicationRepository = jobApplicationRepository;
            _jobPostingRepository = jobPostingRepository;
            _candidateProfileRepository = candidateProfileRepository;
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
            return true;
        }
    }
}
