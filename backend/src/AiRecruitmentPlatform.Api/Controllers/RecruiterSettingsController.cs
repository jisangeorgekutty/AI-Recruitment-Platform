using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Settings;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/recruiter/settings")]
    [Authorize]
    public class RecruiterSettingsController : ControllerBase
    {
        private readonly IRecruiterNotificationPreferenceService _preferenceService;

        public RecruiterSettingsController(IRecruiterNotificationPreferenceService preferenceService)
        {
            _preferenceService = preferenceService;
        }

        [HttpGet("notifications")]
        public async Task<ActionResult<ApiResponse<RecruiterNotificationPreferenceDto>>> GetNotificationPreferences()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _preferenceService.GetPreferencesByUserIdAsync(userId);
                return Ok(ApiResponse<RecruiterNotificationPreferenceDto>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<RecruiterNotificationPreferenceDto>.FailureResult(ex.Message));
            }
        }

        [HttpPut("notifications")]
        public async Task<ActionResult<ApiResponse<RecruiterNotificationPreferenceDto>>> UpdateNotificationPreferences([FromBody] UpdateRecruiterNotificationPreferenceRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _preferenceService.UpdatePreferencesAsync(userId, request);
                return Ok(ApiResponse<RecruiterNotificationPreferenceDto>.SuccessResult(result, "Notification preferences updated successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<RecruiterNotificationPreferenceDto>.FailureResult(ex.Message));
            }
        }

        private long GetCurrentUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("uid");
            if (string.IsNullOrEmpty(userIdStr) || !long.TryParse(userIdStr, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid user token context");
            }
            return userId;
        }
    }
}
