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
    [Route("api/jobapplications")]
    [Authorize]
    public class JobApplicationController : ControllerBase
    {
        private readonly IJobApplicationService _jobApplicationService;

        public JobApplicationController(IJobApplicationService jobApplicationService)
        {
            _jobApplicationService = jobApplicationService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<JobApplicationDto>>> Apply([FromForm] ApplyJobDto applyDto)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var result = await _jobApplicationService.ApplyForJobAsync(userId, applyDto);
                return CreatedAtAction(nameof(GetApplicationById), new { id = result.Id }, ApiResponse<JobApplicationDto>.SuccessResult(result, "Application submitted successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobApplicationDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("my-applications")]
        public async Task<ActionResult<ApiResponse<IEnumerable<JobApplicationDto>>>> GetMyApplications()
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var result = await _jobApplicationService.GetMyApplicationsAsync(userId);
                return Ok(ApiResponse<IEnumerable<JobApplicationDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<JobApplicationDto>>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<ApiResponse<JobApplicationDto>>> GetApplicationById(long id)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var result = await _jobApplicationService.GetApplicationByIdAsync(userId, id);
                if (result == null)
                {
                    return NotFound(ApiResponse<JobApplicationDto>.FailureResult("Application not found."));
                }
                return Ok(ApiResponse<JobApplicationDto>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobApplicationDto>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("{id:long}/withdraw")]
        public async Task<ActionResult<ApiResponse<bool>>> WithdrawApplication(long id)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var success = await _jobApplicationService.WithdrawApplicationAsync(userId, id);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Application not found or already withdrawn."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Application withdrawn successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }

        [HttpGet("job/{jobId:long}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<JobApplicationDto>>>> GetApplicationsForJob(long jobId)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _jobApplicationService.GetApplicationsForJobAsync(recruiterUserId, jobId);
                return Ok(ApiResponse<IEnumerable<JobApplicationDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<JobApplicationDto>>.FailureResult(ex.Message));
            }
        }

        [HttpPatch("{id:long}/status")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateStatus(long id, [FromBody] JobApplicationStatusUpdateDto dto)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var success = await _jobApplicationService.UpdateApplicationStatusAsync(recruiterUserId, id, dto.Status);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Application not found."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Application status updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }
    }
}
