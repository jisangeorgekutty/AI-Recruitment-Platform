using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Notification;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        private long GetUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("uid");
            return long.TryParse(idClaim, out var id) ? id : 0;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = GetUserId();
            var (data, total, unreadCount) = await _notificationService.GetUserNotificationsAsync(userId, page, pageSize);
            return Ok(ApiResponse<object>.SuccessResult(new { data, total, unreadCount }));
        }

        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(long id)
        {
            var userId = GetUserId();
            var success = await _notificationService.MarkAsReadAsync(userId, id);
            if (!success) return NotFound(ApiResponse<bool>.FailureResult("Notification not found"));
            return Ok(ApiResponse<bool>.SuccessResult(true, "Notification marked as read"));
        }

        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = GetUserId();
            await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(ApiResponse<object>.SuccessResult(new { message = "All notifications marked as read" }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var userId = GetUserId();
            var success = await _notificationService.DeleteNotificationAsync(userId, id);
            if (!success) return NotFound(ApiResponse<bool>.FailureResult("Notification not found"));
            return Ok(ApiResponse<object>.SuccessResult(new { message = "Notification deleted" }));
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = GetUserId();
            var count = await _notificationService.GetUnreadCountAsync(userId);
            return Ok(ApiResponse<object>.SuccessResult(new { count }));
        }
    }
}
