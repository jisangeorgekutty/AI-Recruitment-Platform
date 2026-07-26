using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace AiRecruitmentPlatform.Application.Services
{
    public class CandidateProfileService : ICandidateProfileService
    {
        private readonly ICandidateProfileRepository _profileRepo;
        private readonly IRepository<CandidateSocialLink> _socialRepo;
        private readonly IRepository<CandidateExperience> _experienceRepo;
        private readonly IRepository<CandidateEducation> _educationRepo;
        private readonly IRepository<CandidateSkill> _skillRepo;
        private readonly IRepository<CandidateLanguage> _languageRepo;
        private readonly IIdentityService _identityService;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public CandidateProfileService(
            ICandidateProfileRepository profileRepo,
            IRepository<CandidateSocialLink> socialRepo,
            IRepository<CandidateExperience> experienceRepo,
            IRepository<CandidateEducation> educationRepo,
            IRepository<CandidateSkill> skillRepo,
            IRepository<CandidateLanguage> languageRepo,
            IIdentityService identityService,
            IFileService fileService,
            IMapper mapper)
        {
            _profileRepo = profileRepo;
            _socialRepo = socialRepo;
            _experienceRepo = experienceRepo;
            _educationRepo = educationRepo;
            _skillRepo = skillRepo;
            _languageRepo = languageRepo;
            _identityService = identityService;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<CandidateProfileDto> GetProfileByUserIdAsync(long userId)
        {
            var profile = await _profileRepo.GetFullProfileByUserIdAsync(userId);
            var userInfo = await _identityService.GetUserBasicInfoAsync(userId);

            if (profile == null)
            {
                profile = new CandidateProfileInformation
                {
                    UserId = userId,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow
                };
                await _profileRepo.Add(profile);
                await _profileRepo.SaveChanges();
            }

            var social = await _socialRepo.FirstOrDefault(s => s.CandidateProfileInformationId == profile.Id);
            var experiences = await _experienceRepo.Where(e => e.CandidateProfileInformationId == profile.Id);
            var educations = await _educationRepo.Where(e => e.CandidateProfileInformationId == profile.Id);
            var skills = await _skillRepo.Where(s => s.CandidateProfileInformationId == profile.Id);
            var languages = await _languageRepo.Where(l => l.CandidateProfileInformationId == profile.Id);

            var profileDto = _mapper.Map<CandidateProfileDto>(profile);
            profileDto.FirstName = userInfo?.FirstName ?? string.Empty;
            profileDto.LastName = userInfo?.LastName ?? string.Empty;
            profileDto.Email = userInfo?.Email ?? string.Empty;
            profileDto.Phone = userInfo?.Phone;
            profileDto.AvatarUrl = userInfo?.AvatarUrl;

            profileDto.SocialLinks = social == null ? new CandidateSocialLinksDto() : _mapper.Map<CandidateSocialLinksDto>(social);
            profileDto.Experiences = _mapper.Map<List<CandidateExperienceDto>>(experiences);
            profileDto.Educations = _mapper.Map<List<CandidateEducationDto>>(educations);
            profileDto.Skills = _mapper.Map<List<CandidateSkillDto>>(skills);
            profileDto.Languages = _mapper.Map<List<CandidateLanguageDto>>(languages);

            return profileDto;
        }

        public async Task<CandidateProfileDto> GetProfileByIdAsync(long profileInfoId)
        {
            var profile = await _profileRepo.Get(profileInfoId);
            if (profile == null)
            {
                throw new InvalidOperationException("Profile not found.");
            }
            return await GetProfileByUserIdAsync(profile.UserId);
        }

        public async Task<CandidateProfileDto> UpdatePersonalInfoAsync(long userId, UpdateCandidatePersonalInfoRequest request)
        {
            await _identityService.UpdateUserBasicInfoAsync(userId, request.FirstName, request.LastName, request.Phone);

            var profile = await _profileRepo.GetFullProfileByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new CandidateProfileInformation { UserId = userId, CreatedOn = DateTime.UtcNow, ModifiedOn = DateTime.UtcNow };
                await _profileRepo.Add(profile);
            }

            _mapper.Map(request, profile);
            profile.ModifiedOn = DateTime.UtcNow;

            await _profileRepo.Update(profile);
            await _profileRepo.SaveChanges();

            return await GetProfileByUserIdAsync(userId);
        }

        public async Task<CandidateProfileDto> UpdateSocialLinksAsync(long userId, UpdateCandidateSocialLinksRequest request)
        {
            var profile = await _profileRepo.GetFullProfileByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new CandidateProfileInformation { UserId = userId, CreatedOn = DateTime.UtcNow, ModifiedOn = DateTime.UtcNow };
                await _profileRepo.Add(profile);
                await _profileRepo.SaveChanges();
            }

            var social = await _socialRepo.FirstOrDefault(s => s.CandidateProfileInformationId == profile.Id);
            if (social == null)
            {
                social = _mapper.Map<CandidateSocialLink>(request);
                social.CandidateProfileInformationId = profile.Id;
                social.CreatedOn = DateTime.UtcNow;
                social.ModifiedOn = DateTime.UtcNow;
                await _socialRepo.Add(social);
            }
            else
            {
                _mapper.Map(request, social);
                social.ModifiedOn = DateTime.UtcNow;
                await _socialRepo.Update(social);
            }
            await _socialRepo.SaveChanges();

            return await GetProfileByUserIdAsync(userId);
        }

        public async Task<CandidateExperienceDto> AddExperienceAsync(long userId, CandidateExperienceDto dto)
        {
            var profile = await EnsureProfileExistsAsync(userId);

            var exp = _mapper.Map<CandidateExperience>(dto);
            exp.CandidateProfileInformationId = profile.Id;
            exp.CreatedOn = DateTime.UtcNow;
            exp.ModifiedOn = DateTime.UtcNow;

            await _experienceRepo.Add(exp);
            await _experienceRepo.SaveChanges();

            return _mapper.Map<CandidateExperienceDto>(exp);
        }

        public async Task<CandidateExperienceDto> UpdateExperienceAsync(long userId, long experienceId, CandidateExperienceDto dto)
        {
            var exp = await _experienceRepo.Get(experienceId)
                ?? throw new InvalidOperationException("Experience record not found.");

            _mapper.Map(dto, exp);
            exp.ModifiedOn = DateTime.UtcNow;

            await _experienceRepo.Update(exp);
            await _experienceRepo.SaveChanges();

            return _mapper.Map<CandidateExperienceDto>(exp);
        }

        public async Task DeleteExperienceAsync(long userId, long experienceId)
        {
            var exp = await _experienceRepo.Get(experienceId);
            if (exp != null)
            {
                await _experienceRepo.SoftDelete(exp);
                await _experienceRepo.SaveChanges();
            }
        }

        public async Task<CandidateEducationDto> AddEducationAsync(long userId, CandidateEducationDto dto)
        {
            var profile = await EnsureProfileExistsAsync(userId);

            var edu = _mapper.Map<CandidateEducation>(dto);
            edu.CandidateProfileInformationId = profile.Id;
            edu.CreatedOn = DateTime.UtcNow;
            edu.ModifiedOn = DateTime.UtcNow;

            await _educationRepo.Add(edu);
            await _educationRepo.SaveChanges();

            return _mapper.Map<CandidateEducationDto>(edu);
        }

        public async Task<CandidateEducationDto> UpdateEducationAsync(long userId, long educationId, CandidateEducationDto dto)
        {
            var edu = await _educationRepo.Get(educationId)
                ?? throw new InvalidOperationException("Education record not found.");

            _mapper.Map(dto, edu);
            edu.ModifiedOn = DateTime.UtcNow;

            await _educationRepo.Update(edu);
            await _educationRepo.SaveChanges();

            return _mapper.Map<CandidateEducationDto>(edu);
        }

        public async Task DeleteEducationAsync(long userId, long educationId)
        {
            var edu = await _educationRepo.Get(educationId);
            if (edu != null)
            {
                await _educationRepo.SoftDelete(edu);
                await _educationRepo.SaveChanges();
            }
        }

        public async Task<CandidateSkillDto> AddSkillAsync(long userId, CandidateSkillDto dto)
        {
            var profile = await EnsureProfileExistsAsync(userId);

            var skill = _mapper.Map<CandidateSkill>(dto);
            skill.CandidateProfileInformationId = profile.Id;
            skill.CreatedOn = DateTime.UtcNow;
            skill.ModifiedOn = DateTime.UtcNow;

            await _skillRepo.Add(skill);
            await _skillRepo.SaveChanges();

            return _mapper.Map<CandidateSkillDto>(skill);
        }

        public async Task DeleteSkillAsync(long userId, long skillId)
        {
            var skill = await _skillRepo.Get(skillId);
            if (skill != null)
            {
                await _skillRepo.SoftDelete(skill);
                await _skillRepo.SaveChanges();
            }
        }

        public async Task<CandidateLanguageDto> AddLanguageAsync(long userId, CandidateLanguageDto dto)
        {
            var profile = await EnsureProfileExistsAsync(userId);

            var lang = _mapper.Map<CandidateLanguage>(dto);
            lang.CandidateProfileInformationId = profile.Id;
            lang.CreatedOn = DateTime.UtcNow;
            lang.ModifiedOn = DateTime.UtcNow;

            await _languageRepo.Add(lang);
            await _languageRepo.SaveChanges();

            return _mapper.Map<CandidateLanguageDto>(lang);
        }

        public async Task DeleteLanguageAsync(long userId, long languageId)
        {
            var lang = await _languageRepo.Get(languageId);
            if (lang != null)
            {
                await _languageRepo.SoftDelete(lang);
                await _languageRepo.SaveChanges();
            }
        }

        public async Task<string?> UploadAvatarAsync(long userId, IFormFile imageFile)
        {
            var avatarUrl = await _fileService.UploadImageAsync(imageFile, "avatars");
            if (string.IsNullOrEmpty(avatarUrl))
            {
                throw new InvalidOperationException("Failed to upload avatar image.");
            }

            await _identityService.UpdateUserAvatarAsync(userId, avatarUrl);
            return avatarUrl;
        }

        public async Task<string?> UploadResumeAsync(long userId, IFormFile resumeFile)
        {
            var profile = await EnsureProfileExistsAsync(userId);

            var resumeUrl = await _fileService.UploadImageAsync(resumeFile, "resumes");
            if (string.IsNullOrEmpty(resumeUrl))
            {
                throw new InvalidOperationException("Failed to upload resume document.");
            }

            profile.ResumeUrl = resumeUrl;
            profile.ModifiedOn = DateTime.UtcNow;
            await _profileRepo.Update(profile);
            await _profileRepo.SaveChanges();

            return resumeUrl;
        }

        #region Helpers

        private async Task<CandidateProfileInformation> EnsureProfileExistsAsync(long userId)
        {
            var profile = await _profileRepo.GetFullProfileByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new CandidateProfileInformation
                {
                    UserId = userId,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow
                };
                await _profileRepo.Add(profile);
                await _profileRepo.SaveChanges();
            }
            return profile;
        }

        #endregion
    }
}
