using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Job;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AutoMapper;

namespace AiRecruitmentPlatform.Application.Services
{
    public class JobSearchService : IJobSearchService
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly ICandidateProfileRepository _candidateProfileRepository;
        private readonly ICandidateSavedJobRepository _savedJobRepository;
        private readonly IMapper _mapper;

        public JobSearchService(
            IJobPostingRepository jobPostingRepository,
            ICandidateProfileRepository candidateProfileRepository,
            ICandidateSavedJobRepository savedJobRepository,
            IMapper mapper)
        {
            _jobPostingRepository = jobPostingRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _savedJobRepository = savedJobRepository;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<JobPostingDto>> SearchJobsAsync(JobFilterDto filter)
        {
            var pagedResponse = await _jobPostingRepository.GetFilteredJobsAsync(filter);
            var dtos = _mapper.Map<List<JobPostingDto>>(pagedResponse.Items);

            return new PaginatedResponse<JobPostingDto>
            {
                Items = dtos,
                Page = pagedResponse.Page,
                PageSize = pagedResponse.PageSize,
                TotalCount = pagedResponse.TotalCount,
                TotalPages = pagedResponse.TotalPages,
                HasNextPage = pagedResponse.HasNextPage,
                HasPreviousPage = pagedResponse.HasPreviousPage
            };
        }

        public async Task<JobPostingDto?> GetJobDetailsAsync(long jobId, long? currentCandidateUserId = null)
        {
            var entity = await _jobPostingRepository.GetJobPostingWithDetailsAsync(jobId);
            if (entity == null) return null;

            var dto = _mapper.Map<JobPostingDto>(entity);

            if (currentCandidateUserId.HasValue)
            {
                var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(currentCandidateUserId.Value);
                if (candidateProfile != null)
                {
                    dto.IsSaved = await _savedJobRepository.IsJobSavedAsync(candidateProfile.Id, jobId);
                }
            }

            return dto;
        }
    }
}
