using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Job;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AiRecruitmentPlatform.Api.Helpers;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobPostingController : ControllerBase
    {
        private readonly IJobPostingService _jobService;

        public JobPostingController(IJobPostingService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<PaginatedResponse<JobPostingDto>>>> GetJobs([FromQuery] JobFilterDto filter)
        {
            try
            {
                var result = await _jobService.GetJobsAsync(filter);
                return Ok(ApiResponse<PaginatedResponse<JobPostingDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<PaginatedResponse<JobPostingDto>>.FailureResult(ex.Message));
            }
        }

        [HttpGet("stats")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<JobStatsDto>>> GetJobStats()
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var stats = await _jobService.GetJobStatsAsync(userId);
                return Ok(ApiResponse<JobStatsDto>.SuccessResult(stats));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobStatsDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{id:long}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<JobPostingDto>>> GetJobById(long id)
        {
            try
            {
                var job = await _jobService.GetJobByIdAsync(id);
                if (job == null)
                {
                    return NotFound(ApiResponse<JobPostingDto>.FailureResult("Job posting not found."));
                }
                return Ok(ApiResponse<JobPostingDto>.SuccessResult(job));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobPostingDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<JobPostingDto>>> CreateJob([FromBody] CreateJobPostingDto dto)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var job = await _jobService.CreateJobAsync(userId, dto);
                return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, ApiResponse<JobPostingDto>.SuccessResult(job, "Job posting created successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobPostingDto>.FailureResult(ex.Message));
            }
        }

        [HttpPut("{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<JobPostingDto>>> UpdateJob(long id, [FromBody] UpdateJobPostingDto dto)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var job = await _jobService.UpdateJobAsync(id, userId, dto);
                return Ok(ApiResponse<JobPostingDto>.SuccessResult(job, "Job posting updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobPostingDto>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteJob(long id)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var success = await _jobService.DeleteJobAsync(id, userId);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Job posting not found."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Job posting deleted successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }

        [HttpPatch("{id:long}/status")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<JobPostingDto>>> UpdateJobStatus(long id, [FromBody] JobStatusUpdateDto dto)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var job = await _jobService.UpdateJobStatusAsync(id, userId, dto.Status);
                return Ok(ApiResponse<JobPostingDto>.SuccessResult(job, "Job status updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobPostingDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost("{id:long}/duplicate")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<JobPostingDto>>> DuplicateJob(long id)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var job = await _jobService.DuplicateJobAsync(id, userId);
                return Ok(ApiResponse<JobPostingDto>.SuccessResult(job, "Job duplicated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobPostingDto>.FailureResult(ex.Message));
            }
        }
    }
}
