using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Company;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/company")]
    [Authorize]
    public class CompanyProfileController : ControllerBase
    {
        private readonly ICompanyProfileService _companyService;

        public CompanyProfileController(ICompanyProfileService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<CompanyProfileDto>>> GetCompanyProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _companyService.GetCompanyProfileByUserIdAsync(userId);
                return Ok(ApiResponse<CompanyProfileDto>.SuccessResult(profile));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CompanyProfileDto>.FailureResult(ex.Message));
            }
        }

        [HttpPut]
        public async Task<ActionResult<ApiResponse<CompanyProfileDto>>> UpdateCompanyProfile([FromBody] UpdateCompanyProfileRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _companyService.UpdateCompanyProfileAsync(userId, request);
                return Ok(ApiResponse<CompanyProfileDto>.SuccessResult(profile, "Company profile updated successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CompanyProfileDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost("logo")]
        public async Task<ActionResult<ApiResponse<string>>> UploadCompanyLogo(IFormFile logoFile)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (logoFile == null || logoFile.Length == 0)
                {
                    return BadRequest(ApiResponse<string>.FailureResult("No logo file uploaded"));
                }

                var logoUrl = await _companyService.UploadCompanyLogoAsync(userId, logoFile);
                return Ok(ApiResponse<string>.SuccessResult(logoUrl ?? string.Empty, "Company logo uploaded successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
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
