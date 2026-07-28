using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Admin;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IAuditLogService _auditLogService;
        private readonly ISubscriptionPlanService _subscriptionPlanService;

        public AdminController(
            IAdminService adminService,
            IAuditLogService auditLogService,
            ISubscriptionPlanService subscriptionPlanService)
        {
            _adminService = adminService;
            _auditLogService = auditLogService;
            _subscriptionPlanService = subscriptionPlanService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _adminService.GetAdminDashboardStatsAsync();
            return Ok(ApiResponse<AdminDashboardStatsDto>.SuccessResult(stats));
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] string? search, [FromQuery] string? role, [FromQuery] string? status)
        {
            var users = await _adminService.GetUsersAsync(search, role, status);
            return Ok(ApiResponse<object>.SuccessResult(users));
        }

        [HttpPatch("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(long id, [FromBody] UpdateStatusRequest request)
        {
            var success = await _adminService.UpdateUserStatusAsync(id, request.Status);
            return Ok(ApiResponse<bool>.SuccessResult(success, "User status updated"));
        }

        [HttpPatch("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(long id, [FromBody] UpdateRoleRequest request)
        {
            var success = await _adminService.UpdateUserRoleAsync(id, request.Role);
            return Ok(ApiResponse<bool>.SuccessResult(success, "User role updated"));
        }

        [HttpGet("companies")]
        public async Task<IActionResult> GetCompanies([FromQuery] string? search, [FromQuery] string? status)
        {
            var companies = await _adminService.GetCompaniesAsync(search, status);
            return Ok(ApiResponse<object>.SuccessResult(companies));
        }

        [HttpPatch("companies/{id}/status")]
        public async Task<IActionResult> UpdateCompanyStatus(long id, [FromBody] UpdateStatusRequest request)
        {
            var success = await _adminService.UpdateCompanyStatusAsync(id, request.Status);
            return Ok(ApiResponse<bool>.SuccessResult(success, "Company status updated"));
        }

        [HttpGet("plans")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPlans()
        {
            var plans = await _subscriptionPlanService.GetAllPlansAsync();
            return Ok(ApiResponse<object>.SuccessResult(plans));
        }

        [HttpPost("plans")]
        public async Task<IActionResult> CreatePlan([FromBody] CreateSubscriptionPlanDto dto)
        {
            var plan = await _subscriptionPlanService.CreatePlanAsync(dto);
            return Ok(ApiResponse<SubscriptionPlanDto>.SuccessResult(plan, "Subscription plan created"));
        }

        [HttpPut("plans/{id}")]
        public async Task<IActionResult> UpdatePlan(long id, [FromBody] UpdateSubscriptionPlanDto dto)
        {
            var plan = await _subscriptionPlanService.UpdatePlanAsync(id, dto);
            if (plan == null) return NotFound(ApiResponse<SubscriptionPlanDto>.FailureResult("Plan not found"));
            return Ok(ApiResponse<SubscriptionPlanDto>.SuccessResult(plan, "Subscription plan updated"));
        }

        [HttpDelete("plans/{id}")]
        public async Task<IActionResult> DeletePlan(long id)
        {
            var success = await _subscriptionPlanService.DeletePlanAsync(id);
            if (!success) return NotFound(ApiResponse<bool>.FailureResult("Plan not found"));
            return Ok(ApiResponse<bool>.SuccessResult(true, "Subscription plan deleted"));
        }

        [HttpGet("audit-logs")]
        public async Task<IActionResult> GetAuditLogs([FromQuery] string? search, [FromQuery] string? severity, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var logs = await _auditLogService.GetLogsAsync(search, severity, page, pageSize);
            return Ok(ApiResponse<object>.SuccessResult(logs));
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class UpdateRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }
}
