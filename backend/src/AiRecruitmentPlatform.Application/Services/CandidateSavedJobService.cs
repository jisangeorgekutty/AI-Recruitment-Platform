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
    public class CandidateSavedJobService : ICandidateSavedJobService
    {
        private readonly ICandidateSavedJobRepository _savedJobRepository;
        private readonly ICandidateProfileRepository _candidateProfileRepository;
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;

        public CandidateSavedJobService(
            ICandidateSavedJobRepository savedJobRepository,
            ICandidateProfileRepository candidateProfileRepository,
            IJobPostingRepository jobPostingRepository,
            IMapper mapper)
        {
            _savedJobRepository = savedJobRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
        }

        public async Task<bool> SaveJobAsync(long userId, long jobId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null) return false;

            var job = await _jobPostingRepository.Get(jobId);
            if (job == null || job.IsDeleted) return false;

            var existing = await _savedJobRepository.GetSavedJobAsync(candidateProfile.Id, jobId);
            if (existing != null) return true;

            var savedJob = new CandidateSavedJob
            {
                CandidateProfileId = candidateProfile.Id,
                JobPostingId = jobId,
                SavedAt = DateTime.UtcNow
            };

            await _savedJobRepository.Add(savedJob);
            await _savedJobRepository.SaveChanges();
            return true;
        }

        public async Task<bool> RemoveSavedJobAsync(long userId, long jobId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null) return false;

            var savedJob = await _savedJobRepository.GetSavedJobAsync(candidateProfile.Id, jobId);
            if (savedJob == null) return false;

            await _savedJobRepository.SoftDelete(savedJob);
            await _savedJobRepository.SaveChanges();
            return true;
        }

        public async Task<IEnumerable<CandidateSavedJobDto>> GetMySavedJobsAsync(long userId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null)
            {
                return new List<CandidateSavedJobDto>();
            }

            var savedJobs = await _savedJobRepository.GetByCandidateIdAsync(candidateProfile.Id);
            return _mapper.Map<List<CandidateSavedJobDto>>(savedJobs);
        }

        public async Task<bool> IsJobSavedAsync(long userId, long jobId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null) return false;

            return await _savedJobRepository.IsJobSavedAsync(candidateProfile.Id, jobId);
        }
    }
}
