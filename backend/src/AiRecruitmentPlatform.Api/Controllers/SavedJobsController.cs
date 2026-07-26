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
    [Route("api/saved-jobs")]
    [Authorize]
    public class SavedJobsController : ControllerBase
    {
        private readonly ICandidateSavedJobService _savedJobService;

        public SavedJobsController(ICandidateSavedJobService savedJobService)
        {
            _savedJobService = savedJobService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<CandidateSavedJobDto>>>> GetMySavedJobs()
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var result = await _savedJobService.GetMySavedJobsAsync(userId);
                return Ok(ApiResponse<IEnumerable<CandidateSavedJobDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<CandidateSavedJobDto>>.FailureResult(ex.Message));
            }
        }

        [HttpPost("{jobId:long}")]
        public async Task<ActionResult<ApiResponse<bool>>> SaveJob(long jobId)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var success = await _savedJobService.SaveJobAsync(userId, jobId);
                if (!success)
                {
                    return BadRequest(ApiResponse<bool>.FailureResult("Unable to save job."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Job saved successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("{jobId:long}")]
        public async Task<ActionResult<ApiResponse<bool>>> RemoveSavedJob(long jobId)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var success = await _savedJobService.RemoveSavedJobAsync(userId, jobId);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Saved job not found."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Job removed from saved jobs."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }
    }
}
