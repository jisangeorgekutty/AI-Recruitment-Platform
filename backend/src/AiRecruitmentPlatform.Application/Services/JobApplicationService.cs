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
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly ICandidateProfileRepository _candidateProfileRepository;
        private readonly ICandidateResumeRepository _candidateResumeRepository;
        private readonly ICompanyProfileRepository _companyProfileRepository;
        private readonly IIdentityService _identityService;
        private readonly INotificationService _notificationService;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public JobApplicationService(
            IJobApplicationRepository jobApplicationRepository,
            IJobPostingRepository jobPostingRepository,
            ICandidateProfileRepository candidateProfileRepository,
            ICandidateResumeRepository candidateResumeRepository,
            ICompanyProfileRepository companyProfileRepository,
            IIdentityService identityService,
            INotificationService notificationService,
            IFileService fileService,
            IMapper mapper)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _jobPostingRepository = jobPostingRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _candidateResumeRepository = candidateResumeRepository;
            _companyProfileRepository = companyProfileRepository;
            _identityService = identityService;
            _notificationService = notificationService;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<JobApplicationDto> ApplyForJobAsync(long userId, ApplyJobDto applyDto)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null)
            {
                throw new InvalidOperationException("Candidate profile not found. Please complete candidate profile first.");
            }

            var jobPosting = await _jobPostingRepository.Get(applyDto.JobPostingId);
            if (jobPosting == null || jobPosting.IsDeleted)
            {
                throw new KeyNotFoundException("Job posting not found.");
            }

            var alreadyApplied = await _jobApplicationRepository.HasCandidateAppliedAsync(candidateProfile.Id, applyDto.JobPostingId);
            if (alreadyApplied)
            {
                throw new InvalidOperationException("You have already applied for this job.");
            }

            var application = new JobApplication
            {
                JobPostingId = applyDto.JobPostingId,
                CandidateProfileId = candidateProfile.Id,
                CandidateResumeId = applyDto.CandidateResumeId,
                CoverLetter = applyDto.CoverLetter,
                Status = "Applied",
                AppliedDate = DateTime.UtcNow
            };

            var added = await _jobApplicationRepository.Add(application);
            await _jobApplicationRepository.SaveChanges();

            // Trigger Notifications
            try
            {
                // Confirmation to Candidate
                await _notificationService.CreateAndSendNotificationAsync(new CreateNotificationDto
                {
                    UserId = userId,
                    Title = "Application Submitted",
                    Message = $"Your application for {jobPosting.Title} has been submitted successfully.",
                    Type = "ApplicationStatus",
                    LinkUrl = "/candidate/applications"
                });

                // Alert to Recruiter (if company profile available)
                var company = await _companyProfileRepository.Get(jobPosting.CompanyProfileId);
                if (company != null && company.UserId > 0)
                {
                    await _notificationService.CreateAndSendNotificationAsync(new CreateNotificationDto
                    {
                        UserId = company.UserId,
                        Title = "New Job Application Received",
                        Message = $"A new application was received for {jobPosting.Title}.",
                        Type = "ApplicationStatus",
                        LinkUrl = "/recruiter/candidates"
                    });
                }
            }
            catch { }

            return _mapper.Map<JobApplicationDto>(added);
        }

        public async Task<IEnumerable<JobApplicationDto>> GetMyApplicationsAsync(long userId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null) return new List<JobApplicationDto>();

            var applications = await _jobApplicationRepository.GetCandidateApplicationsAsync(candidateProfile.Id);
            var dtos = _mapper.Map<List<JobApplicationDto>>(applications);

            var userBasic = await _identityService.GetUserBasicInfoAsync(userId);
            if (userBasic.HasValue)
            {
                foreach (var dto in dtos)
                {
                    dto.CandidateName = $"{userBasic.Value.FirstName} {userBasic.Value.LastName}".Trim();
                    dto.CandidateEmail = userBasic.Value.Email;
                    dto.CandidatePhone = userBasic.Value.Phone;
                }
            }

            return dtos;
        }

        public async Task<JobApplicationDto?> GetApplicationByIdAsync(long userId, long applicationId)
        {
            var application = await _jobApplicationRepository.GetByIdWithDetailsAsync(applicationId);
            if (application == null) return null;

            var dto = _mapper.Map<JobApplicationDto>(application);
            return dto;
        }

        public async Task<bool> WithdrawApplicationAsync(long userId, long applicationId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null) return false;

            var application = await _jobApplicationRepository.Get(applicationId);
            if (application == null || application.CandidateProfileId != candidateProfile.Id) return false;

            application.Status = "Withdrawn";
            await _jobApplicationRepository.Update(application);
            await _jobApplicationRepository.SaveChanges();
            return true;
        }

        public async Task<IEnumerable<JobApplicationDto>> GetApplicationsForJobAsync(long recruiterUserId, long jobId)
        {
            var applications = await _jobApplicationRepository.GetJobApplicationsAsync(jobId);
            var dtos = _mapper.Map<List<JobApplicationDto>>(applications);

            foreach (var dto in dtos)
            {
                var candidate = await _candidateProfileRepository.GetFullProfileByIdAsync(dto.CandidateProfileId);
                if (candidate != null)
                {
                    var userBasic = await _identityService.GetUserBasicInfoAsync(candidate.UserId);
                    if (userBasic.HasValue)
                    {
                        dto.CandidateName = $"{userBasic.Value.FirstName} {userBasic.Value.LastName}".Trim();
                        dto.CandidateEmail = userBasic.Value.Email;
                        dto.CandidatePhone = userBasic.Value.Phone;
                    }
                }
            }

            return dtos;
        }

        public async Task<bool> UpdateApplicationStatusAsync(long recruiterUserId, long applicationId, string newStatus)
        {
            var application = await _jobApplicationRepository.Get(applicationId);
            if (application == null) return false;

            application.Status = newStatus;
            await _jobApplicationRepository.Update(application);
            await _jobApplicationRepository.SaveChanges();

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
                        Title = "Application Status Updated",
                        Message = $"Your application status for {jobTitle} has been updated to {newStatus}.",
                        Type = "ApplicationStatus",
                        LinkUrl = "/candidate/applications"
                    });
                }
            }
            catch { }

            return true;
        }
    }
}
