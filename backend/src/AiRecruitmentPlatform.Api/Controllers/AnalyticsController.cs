using System.Security.Claims;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IRecruitmentAnalyticsService _analyticsService;

        public AnalyticsController(IRecruitmentAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        private long GetUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("uid");
            return long.TryParse(idClaim, out var id) ? id : 0;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var userId = GetUserId();
            var stats = await _analyticsService.GetDashboardStatsAsync(userId);
            return Ok(ApiResponse<object>.SuccessResult(stats));
        }

        [HttpGet("hiring-funnel")]
        public async Task<IActionResult> GetHiringFunnel()
        {
            var userId = GetUserId();
            var funnel = await _analyticsService.GetHiringFunnelAsync(userId);
            return Ok(ApiResponse<object>.SuccessResult(funnel));
        }

        [HttpGet("time-to-hire")]
        public async Task<IActionResult> GetTimeToHire()
        {
            var userId = GetUserId();
            var timeToHire = await _analyticsService.GetTimeToHireAsync(userId);
            return Ok(ApiResponse<object>.SuccessResult(timeToHire));
        }

        [HttpGet("source-breakdown")]
        public async Task<IActionResult> GetSourceBreakdown()
        {
            var userId = GetUserId();
            var sources = await _analyticsService.GetSourceBreakdownAsync(userId);
            return Ok(ApiResponse<object>.SuccessResult(sources));
        }

        [HttpGet("diversity")]
        public async Task<IActionResult> GetDiversityMetrics()
        {
            var userId = GetUserId();
            var metrics = await _analyticsService.GetDiversityMetricsAsync(userId);
            return Ok(ApiResponse<object>.SuccessResult(metrics));
        }

        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 10)
        {
            var userId = GetUserId();
            var activity = await _analyticsService.GetRecentActivityAsync(userId, limit);
            return Ok(ApiResponse<object>.SuccessResult(activity));
        }
    }
}
