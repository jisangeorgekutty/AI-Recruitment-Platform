using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Api.Helpers;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Job;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/job-match")]
    [Authorize]
    public class JobMatchController : ControllerBase
    {
        private readonly IAiJobMatchService _aiJobMatchService;

        public JobMatchController(IAiJobMatchService aiJobMatchService)
        {
            _aiJobMatchService = aiJobMatchService;
        }

        [HttpGet("application/{applicationId:long}")]
        public async Task<ActionResult<ApiResponse<JobMatchResultDto>>> GetApplicationMatch(long applicationId)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _aiJobMatchService.GetApplicationMatchAsync(recruiterUserId, applicationId);
                if (result == null)
                {
                    return NotFound(ApiResponse<JobMatchResultDto>.FailureResult("Job application match analysis not found."));
                }
                return Ok(ApiResponse<JobMatchResultDto>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobMatchResultDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost("application/{applicationId:long}/recalculate")]
        public async Task<ActionResult<ApiResponse<JobMatchResultDto>>> RecalculateApplicationMatch(long applicationId)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _aiJobMatchService.EvaluateApplicationMatchAsync(recruiterUserId, applicationId);
                return Ok(ApiResponse<JobMatchResultDto>.SuccessResult(result, "AI Match evaluation completed successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobMatchResultDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("job/{jobId:long}/ranked-applications")]
        public async Task<ActionResult<ApiResponse<IEnumerable<JobMatchResultDto>>>> GetRankedMatchesForJob(long jobId)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _aiJobMatchService.GetRankedMatchesForJobAsync(recruiterUserId, jobId);
                return Ok(ApiResponse<IEnumerable<JobMatchResultDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<JobMatchResultDto>>.FailureResult(ex.Message));
            }
        }
    }
}
