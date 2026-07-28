using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Admin;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;

namespace AiRecruitmentPlatform.Application.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly IMapper _mapper;

        public AuditLogService(IAuditLogRepository auditLogRepository, IMapper mapper)
        {
            _auditLogRepository = auditLogRepository;
            _mapper = mapper;
        }

        public async Task LogAsync(long? userId, string userEmail, string action, string target, string severity = "info", string? details = null, string? ipAddress = null)
        {
            var log = new AuditLog
            {
                UserId = userId,
                UserEmail = userEmail,
                Action = action,
                Target = target,
                Severity = severity,
                Details = details,
                IpAddress = ipAddress
            };

            await _auditLogRepository.Add(log);
            await _auditLogRepository.SaveChanges();
        }

        public async Task<IReadOnlyList<AuditLogDto>> GetLogsAsync(string? search, string? severity, int page = 1, int pageSize = 50)
        {
            var logs = await _auditLogRepository.GetFilteredLogsAsync(search, severity, page, pageSize);
            return _mapper.Map<IReadOnlyList<AuditLogDto>>(logs);
        }
    }
}
