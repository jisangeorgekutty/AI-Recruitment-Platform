using System;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Api.Helpers;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Recruiter;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/recruiter/talent-pool")]
    [Authorize]
    public class RecruiterTalentPoolController : ControllerBase
    {
        private readonly IRecruiterTalentPoolService _talentPoolService;

        public RecruiterTalentPoolController(IRecruiterTalentPoolService talentPoolService)
        {
            _talentPoolService = talentPoolService;
        }

        [HttpPost("parse-upload")]
        public async Task<ActionResult<ApiResponse<RecruiterParsedResumeDto>>> ParseAndSaveUpload(IFormFile file)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _talentPoolService.ParseAndSaveResumeAsync(recruiterUserId, file);
                return Ok(ApiResponse<RecruiterParsedResumeDto>.SuccessResult(result, "Resume successfully parsed with AI and saved to company talent pool."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<RecruiterParsedResumeDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResponse<RecruiterParsedResumeDto>>>> GetTalentPool(
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _talentPoolService.GetTalentPoolResumesAsync(recruiterUserId, search, page, pageSize);
                return Ok(ApiResponse<PaginatedResponse<RecruiterParsedResumeDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<PaginatedResponse<RecruiterParsedResumeDto>>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<ApiResponse<RecruiterParsedResumeDto>>> GetById(long id)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _talentPoolService.GetTalentResumeByIdAsync(recruiterUserId, id);
                if (result == null)
                {
                    return NotFound(ApiResponse<RecruiterParsedResumeDto>.FailureResult("Parsed talent resume not found in company talent pool."));
                }
                return Ok(ApiResponse<RecruiterParsedResumeDto>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<RecruiterParsedResumeDto>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("{id:long}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var success = await _talentPoolService.DeleteTalentResumeAsync(recruiterUserId, id);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Parsed talent resume not found."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Talent resume removed from company talent pool."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }
    }
}
