using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
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

        public CandidateProfileService(
            ICandidateProfileRepository profileRepo,
            IRepository<CandidateSocialLink> socialRepo,
            IRepository<CandidateExperience> experienceRepo,
            IRepository<CandidateEducation> educationRepo,
            IRepository<CandidateSkill> skillRepo,
            IRepository<CandidateLanguage> languageRepo,
            IIdentityService identityService,
            IFileService fileService)
        {
            _profileRepo = profileRepo;
            _socialRepo = socialRepo;
            _experienceRepo = experienceRepo;
            _educationRepo = educationRepo;
            _skillRepo = skillRepo;
            _languageRepo = languageRepo;
            _identityService = identityService;
            _fileService = fileService;
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

            return new CandidateProfileDto
            {
                ProfileInformationId = profile.Id,
                UserId = profile.UserId,
                FirstName = userInfo?.FirstName ?? string.Empty,
                LastName = userInfo?.LastName ?? string.Empty,
                Email = userInfo?.Email ?? string.Empty,
                Phone = userInfo?.Phone,
                AvatarUrl = userInfo?.AvatarUrl,
                CurrentTitle = profile.CurrentTitle,
                Location = profile.Location,
                Summary = profile.Summary,
                ResumeUrl = profile.ResumeUrl,
                YearsOfExperience = profile.YearsOfExperience,
                SocialLinks = social == null ? null : new CandidateSocialLinksDto
                {
                    GitHubUrl = social.GitHubUrl,
                    LinkedInUrl = social.LinkedInUrl,
                    PortfolioUrl = social.PortfolioUrl,
                    WebsiteUrl = social.WebsiteUrl
                },
                Experiences = experiences.Select(e => new CandidateExperienceDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Company = e.Company,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCurrent = e.IsCurrent,
                    Description = e.Description
                }).ToList(),
                Educations = educations.Select(e => new CandidateEducationDto
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
                }).ToList(),
                Skills = skills.Select(s => new CandidateSkillDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Proficiency = s.Proficiency
                }).ToList(),
                Languages = languages.Select(l => new CandidateLanguageDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Proficiency = l.Proficiency
                }).ToList()
            };
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

            profile.CurrentTitle = request.CurrentTitle;
            profile.Location = request.Location;
            profile.Summary = request.Summary;
            profile.YearsOfExperience = request.YearsOfExperience;
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
                social = new CandidateSocialLink
                {
                    CandidateProfileInformationId = profile.Id,
                    GitHubUrl = request.GitHubUrl,
                    LinkedInUrl = request.LinkedInUrl,
                    PortfolioUrl = request.PortfolioUrl,
                    WebsiteUrl = request.WebsiteUrl,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow
                };
                await _socialRepo.Add(social);
            }
            else
            {
                social.GitHubUrl = request.GitHubUrl;
                social.LinkedInUrl = request.LinkedInUrl;
                social.PortfolioUrl = request.PortfolioUrl;
                social.WebsiteUrl = request.WebsiteUrl;
                social.ModifiedOn = DateTime.UtcNow;
                await _socialRepo.Update(social);
            }
            await _socialRepo.SaveChanges();

            return await GetProfileByUserIdAsync(userId);
        }

        public async Task<CandidateExperienceDto> AddExperienceAsync(long userId, CandidateExperienceDto dto)
        {
            var profile = await EnsureProfileExistsAsync(userId);

            var exp = new CandidateExperience
            {
                CandidateProfileInformationId = profile.Id,
                Title = dto.Title,
                Company = dto.Company,
                Location = dto.Location,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                IsCurrent = dto.IsCurrent,
                Description = dto.Description,
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow
            };

            await _experienceRepo.Add(exp);
            await _experienceRepo.SaveChanges();

            dto.Id = exp.Id;
            return dto;
        }

        public async Task<CandidateExperienceDto> UpdateExperienceAsync(long userId, long experienceId, CandidateExperienceDto dto)
        {
            var exp = await _experienceRepo.Get(experienceId)
                ?? throw new InvalidOperationException("Experience record not found.");

            exp.Title = dto.Title;
            exp.Company = dto.Company;
            exp.Location = dto.Location;
            exp.StartDate = dto.StartDate;
            exp.EndDate = dto.EndDate;
            exp.IsCurrent = dto.IsCurrent;
            exp.Description = dto.Description;
            exp.ModifiedOn = DateTime.UtcNow;

            await _experienceRepo.Update(exp);
            await _experienceRepo.SaveChanges();

            return dto;
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

            var edu = new CandidateEducation
            {
                CandidateProfileInformationId = profile.Id,
                Institution = dto.Institution,
                Degree = dto.Degree,
                FieldOfStudy = dto.FieldOfStudy,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                IsCurrent = dto.IsCurrent,
                Grade = dto.Grade,
                Description = dto.Description,
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow
            };

            await _educationRepo.Add(edu);
            await _educationRepo.SaveChanges();

            dto.Id = edu.Id;
            return dto;
        }

        public async Task<CandidateEducationDto> UpdateEducationAsync(long userId, long educationId, CandidateEducationDto dto)
        {
            var edu = await _educationRepo.Get(educationId)
                ?? throw new InvalidOperationException("Education record not found.");

            edu.Institution = dto.Institution;
            edu.Degree = dto.Degree;
            edu.FieldOfStudy = dto.FieldOfStudy;
            edu.StartDate = dto.StartDate;
            edu.EndDate = dto.EndDate;
            edu.IsCurrent = dto.IsCurrent;
            edu.Grade = dto.Grade;
            edu.Description = dto.Description;
            edu.ModifiedOn = DateTime.UtcNow;

            await _educationRepo.Update(edu);
            await _educationRepo.SaveChanges();

            return dto;
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

            var skill = new CandidateSkill
            {
                CandidateProfileInformationId = profile.Id,
                Name = dto.Name,
                Proficiency = dto.Proficiency,
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow
            };

            await _skillRepo.Add(skill);
            await _skillRepo.SaveChanges();

            dto.Id = skill.Id;
            return dto;
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

            var lang = new CandidateLanguage
            {
                CandidateProfileInformationId = profile.Id,
                Name = dto.Name,
                Proficiency = dto.Proficiency,
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow
            };

            await _languageRepo.Add(lang);
            await _languageRepo.SaveChanges();

            dto.Id = lang.Id;
            return dto;
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
