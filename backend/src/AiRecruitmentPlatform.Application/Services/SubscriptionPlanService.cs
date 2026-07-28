using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Admin;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;

namespace AiRecruitmentPlatform.Application.Services
{
    public class SubscriptionPlanService : ISubscriptionPlanService
    {
        private readonly ISubscriptionPlanRepository _subscriptionPlanRepository;
        private readonly IAuditLogService _auditLogService;
        private readonly IMapper _mapper;

        public SubscriptionPlanService(
            ISubscriptionPlanRepository subscriptionPlanRepository,
            IAuditLogService auditLogService,
            IMapper mapper)
        {
            _subscriptionPlanRepository = subscriptionPlanRepository;
            _auditLogService = auditLogService;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<SubscriptionPlanDto>> GetAllPlansAsync()
        {
            var plans = await _subscriptionPlanRepository.GetOrderedPlansAsync();
            var dtos = new List<SubscriptionPlanDto>();

            foreach (var p in plans)
            {
                var dto = _mapper.Map<SubscriptionPlanDto>(p);
                try
                {
                    dto.Features = JsonSerializer.Deserialize<List<string>>(p.FeaturesJson) ?? new List<string>();
                }
                catch
                {
                    dto.Features = new List<string>();
                }
                dtos.Add(dto);
            }

            return dtos;
        }

        public async Task<SubscriptionPlanDto?> GetPlanByIdAsync(long id)
        {
            var plan = await _subscriptionPlanRepository.GetActive(id);
            if (plan == null) return null;

            var dto = _mapper.Map<SubscriptionPlanDto>(plan);
            try
            {
                dto.Features = JsonSerializer.Deserialize<List<string>>(plan.FeaturesJson) ?? new List<string>();
            }
            catch
            {
                dto.Features = new List<string>();
            }
            return dto;
        }

        public async Task<SubscriptionPlanDto> CreatePlanAsync(CreateSubscriptionPlanDto dto)
        {
            var entity = _mapper.Map<SubscriptionPlan>(dto);
            entity.FeaturesJson = JsonSerializer.Serialize(dto.Features ?? new List<string>());

            var added = await _subscriptionPlanRepository.Add(entity);
            await _subscriptionPlanRepository.SaveChanges();

            await _auditLogService.LogAsync(null, "admin@system.local", "Subscription Plan Created", $"Plan {dto.Name} created", "medium");

            var result = _mapper.Map<SubscriptionPlanDto>(added);
            result.Features = dto.Features ?? new List<string>();
            return result;
        }

        public async Task<SubscriptionPlanDto?> UpdatePlanAsync(long id, UpdateSubscriptionPlanDto dto)
        {
            var plan = await _subscriptionPlanRepository.GetActive(id);
            if (plan == null) return null;

            plan.Name = dto.Name;
            plan.Price = dto.Price;
            plan.BillingCycle = dto.BillingCycle;
            plan.MaxUsers = dto.MaxUsers;
            plan.MaxJobs = dto.MaxJobs;
            plan.BadgeColor = dto.BadgeColor;
            plan.DisplayOrder = dto.DisplayOrder;
            plan.FeaturesJson = JsonSerializer.Serialize(dto.Features ?? new List<string>());

            await _subscriptionPlanRepository.Update(plan);
            await _subscriptionPlanRepository.SaveChanges();

            await _auditLogService.LogAsync(null, "admin@system.local", "Subscription Plan Updated", $"Plan {dto.Name} updated", "medium");

            var result = _mapper.Map<SubscriptionPlanDto>(plan);
            result.Features = dto.Features ?? new List<string>();
            return result;
        }

        public async Task<bool> DeletePlanAsync(long id)
        {
            var plan = await _subscriptionPlanRepository.GetActive(id);
            if (plan == null) return false;

            await _subscriptionPlanRepository.SoftDelete(plan);
            await _subscriptionPlanRepository.SaveChanges();

            await _auditLogService.LogAsync(null, "admin@system.local", "Subscription Plan Deleted", $"Plan {plan.Name} deleted", "high");
            return true;
        }
    }
}
