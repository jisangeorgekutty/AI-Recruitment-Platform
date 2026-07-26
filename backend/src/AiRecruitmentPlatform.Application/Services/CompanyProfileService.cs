using System;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Company;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace AiRecruitmentPlatform.Application.Services
{
    public class CompanyProfileService : ICompanyProfileService
    {
        private readonly ICompanyProfileRepository _companyRepo;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public CompanyProfileService(
            ICompanyProfileRepository companyRepo,
            IFileService fileService,
            IMapper mapper)
        {
            _companyRepo = companyRepo;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<CompanyProfileDto> GetCompanyProfileByUserIdAsync(long userId)
        {
            var profile = await _companyRepo.GetByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new CompanyProfile
                {
                    UserId = userId,
                    CompanyName = "My Company",
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow
                };

                await _companyRepo.Add(profile);
                await _companyRepo.SaveChanges();
            }

            return _mapper.Map<CompanyProfileDto>(profile);
        }

        public async Task<CompanyProfileDto> UpdateCompanyProfileAsync(long userId, UpdateCompanyProfileRequest request)
        {
            var profile = await _companyRepo.GetByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new CompanyProfile
                {
                    UserId = userId,
                    CreatedOn = DateTime.UtcNow
                };
                _mapper.Map(request, profile);
                profile.ModifiedOn = DateTime.UtcNow;

                await _companyRepo.Add(profile);
            }
            else
            {
                _mapper.Map(request, profile);
                profile.ModifiedOn = DateTime.UtcNow;

                await _companyRepo.Update(profile);
            }

            await _companyRepo.SaveChanges();
            return _mapper.Map<CompanyProfileDto>(profile);
        }

        public async Task<string?> UploadCompanyLogoAsync(long userId, IFormFile logoFile)
        {
            var profile = await _companyRepo.GetByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new CompanyProfile
                {
                    UserId = userId,
                    CompanyName = "My Company",
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow
                };
                await _companyRepo.Add(profile);
                await _companyRepo.SaveChanges();
            }

            var logoUrl = await _fileService.UploadImageAsync(logoFile, "company-logos");
            if (string.IsNullOrEmpty(logoUrl))
            {
                throw new InvalidOperationException("Failed to upload company logo image.");
            }

            profile.CompanyLogoUrl = logoUrl;
            profile.ModifiedOn = DateTime.UtcNow;

            await _companyRepo.Update(profile);
            await _companyRepo.SaveChanges();

            return logoUrl;
        }
    }
}
