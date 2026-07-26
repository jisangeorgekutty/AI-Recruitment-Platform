using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;

namespace AiRecruitmentPlatform.Application.Services
{
    public class CandidateResumeService : ICandidateResumeService
    {
        private readonly ICandidateResumeRepository _candidateResumeRepository;
        private readonly ICandidateProfileRepository _candidateProfileRepository;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public CandidateResumeService(
            ICandidateResumeRepository candidateResumeRepository,
            ICandidateProfileRepository candidateProfileRepository,
            IFileService fileService,
            IMapper mapper)
        {
            _candidateResumeRepository = candidateResumeRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<CandidateResumeDto> UploadResumeAsync(long userId, UploadResumeDto uploadDto)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null)
            {
                throw new InvalidOperationException("Candidate profile not found.");
            }

            var fileUrl = await _fileService.UploadImageAsync(uploadDto.File, "resumes");
            if (string.IsNullOrEmpty(fileUrl))
            {
                throw new InvalidOperationException("Failed to upload resume file.");
            }

            var ext = Path.GetExtension(uploadDto.File.FileName).Replace(".", "").ToUpperInvariant();

            var resume = new CandidateResume
            {
                CandidateProfileId = candidateProfile.Id,
                FileName = uploadDto.File.FileName,
                FileUrl = fileUrl,
                FileType = string.IsNullOrEmpty(ext) ? "PDF" : ext,
                FileSize = uploadDto.File.Length,
                IsPrimary = uploadDto.IsPrimary,
                UploadedAt = DateTime.UtcNow
            };

            await _candidateResumeRepository.Add(resume);
            await _candidateResumeRepository.SaveChanges();

            if (uploadDto.IsPrimary)
            {
                await _candidateResumeRepository.SetPrimaryResumeAsync(candidateProfile.Id, resume.Id);
                // Also sync CandidateProfileInformation ResumeUrl
                candidateProfile.ResumeUrl = fileUrl;
                await _candidateProfileRepository.Update(candidateProfile);
                await _candidateProfileRepository.SaveChanges();
            }

            return _mapper.Map<CandidateResumeDto>(resume);
        }

        public async Task<IEnumerable<CandidateResumeDto>> GetMyResumesAsync(long userId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null)
            {
                return new List<CandidateResumeDto>();
            }

            var resumes = await _candidateResumeRepository.GetByCandidateIdAsync(candidateProfile.Id);
            return _mapper.Map<List<CandidateResumeDto>>(resumes);
        }

        public async Task<bool> SetPrimaryResumeAsync(long userId, long resumeId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null) return false;

            var resume = await _candidateResumeRepository.Get(resumeId);
            if (resume == null || resume.CandidateProfileId != candidateProfile.Id) return false;

            await _candidateResumeRepository.SetPrimaryResumeAsync(candidateProfile.Id, resumeId);

            candidateProfile.ResumeUrl = resume.FileUrl;
            await _candidateProfileRepository.Update(candidateProfile);
            await _candidateProfileRepository.SaveChanges();

            return true;
        }

        public async Task<bool> DeleteResumeAsync(long userId, long resumeId)
        {
            var candidateProfile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (candidateProfile == null) return false;

            var resume = await _candidateResumeRepository.Get(resumeId);
            if (resume == null || resume.CandidateProfileId != candidateProfile.Id) return false;

            await _candidateResumeRepository.SoftDelete(resume);
            await _candidateResumeRepository.SaveChanges();
            return true;
        }
    }
}
