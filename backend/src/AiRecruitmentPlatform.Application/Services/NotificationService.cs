using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Framework;
using AiRecruitmentPlatform.Application.DTOs.Notification;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;
using AutoMapper;
using MimeKit;

namespace AiRecruitmentPlatform.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public NotificationService(
            INotificationRepository notificationRepository,
            IEmailService emailService,
            IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<NotificationDto> CreateAndSendNotificationAsync(CreateNotificationDto dto)
        {
            var notification = new Notification
            {
                UserId = dto.UserId,
                Title = dto.Title,
                Message = dto.Message,
                Type = dto.Type,
                LinkUrl = dto.LinkUrl,
                IsRead = false
            };

            var added = await _notificationRepository.Add(notification);
            await _notificationRepository.SaveChanges();

            // Attempt email alert
            try
            {
                var msg = new MessageDto
                {
                    To = new List<MailboxAddress> { new MailboxAddress("User", $"user_{dto.UserId}@platform.local") },
                    Subject = dto.Title,
                    Content = dto.Message
                };
                await _emailService.Send(msg);
            }
            catch
            {
                // Fallback silently if email server unconfigured
            }

            return _mapper.Map<NotificationDto>(added);
        }

        public async Task<(IReadOnlyList<NotificationDto> Data, int Total, int UnreadCount)> GetUserNotificationsAsync(long userId, int page, int pageSize)
        {
            var list = await _notificationRepository.GetUserNotificationsAsync(userId, page, pageSize);
            var unreadCount = await _notificationRepository.GetUnreadCountAsync(userId);
            var totalList = await _notificationRepository.WhereActive(n => n.UserId == userId);

            var dtos = _mapper.Map<IReadOnlyList<NotificationDto>>(list);
            return (dtos, totalList.Count, unreadCount);
        }

        public async Task<bool> MarkAsReadAsync(long userId, long notificationId)
        {
            var notification = await _notificationRepository.FirstOrDefaultActive(n => n.Id == notificationId && n.UserId == userId);
            if (notification == null) return false;

            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            await _notificationRepository.Update(notification);
            await _notificationRepository.SaveChanges();
            return true;
        }

        public async Task<bool> MarkAllAsReadAsync(long userId)
        {
            await _notificationRepository.MarkAllAsReadAsync(userId);
            return true;
        }

        public async Task<bool> DeleteNotificationAsync(long userId, long notificationId)
        {
            var notification = await _notificationRepository.FirstOrDefaultActive(n => n.Id == notificationId && n.UserId == userId);
            if (notification == null) return false;

            await _notificationRepository.SoftDelete(notification);
            await _notificationRepository.SaveChanges();
            return true;
        }

        public async Task<int> GetUnreadCountAsync(long userId)
        {
            return await _notificationRepository.GetUnreadCountAsync(userId);
        }
    }
}
