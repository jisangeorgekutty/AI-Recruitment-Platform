using System;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Settings;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;

namespace AiRecruitmentPlatform.Application.Services
{
    public class RecruiterNotificationPreferenceService : IRecruiterNotificationPreferenceService
    {
        private readonly IRecruiterNotificationPreferenceRepository _preferenceRepo;
        private readonly IMapper _mapper;

        public RecruiterNotificationPreferenceService(
            IRecruiterNotificationPreferenceRepository preferenceRepo,
            IMapper mapper)
        {
            _preferenceRepo = preferenceRepo;
            _mapper = mapper;
        }

        public async Task<RecruiterNotificationPreferenceDto> GetPreferencesByUserIdAsync(long userId)
        {
            var preference = await _preferenceRepo.GetByUserIdAsync(userId);
            if (preference == null)
            {
                preference = new RecruiterNotificationPreference
                {
                    UserId = userId,
                    EmailNotifications = true,
                    PushNotifications = true,
                    ApplicationUpdates = true,
                    InterviewReminders = true,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow
                };

                await _preferenceRepo.Add(preference);
                await _preferenceRepo.SaveChanges();
            }

            return _mapper.Map<RecruiterNotificationPreferenceDto>(preference);
        }

        public async Task<RecruiterNotificationPreferenceDto> UpdatePreferencesAsync(long userId, UpdateRecruiterNotificationPreferenceRequest request)
        {
            var preference = await _preferenceRepo.GetByUserIdAsync(userId);
            if (preference == null)
            {
                preference = new RecruiterNotificationPreference
                {
                    UserId = userId,
                    CreatedOn = DateTime.UtcNow
                };
                _mapper.Map(request, preference);
                preference.ModifiedOn = DateTime.UtcNow;

                await _preferenceRepo.Add(preference);
            }
            else
            {
                _mapper.Map(request, preference);
                preference.ModifiedOn = DateTime.UtcNow;

                await _preferenceRepo.Update(preference);
            }

            await _preferenceRepo.SaveChanges();
            return _mapper.Map<RecruiterNotificationPreferenceDto>(preference);
        }
    }
}
