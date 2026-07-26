using System;
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
    [Route("api/jobsearch")]
    public class JobSearchController : ControllerBase
    {
        private readonly IJobSearchService _jobSearchService;

        public JobSearchController(IJobSearchService jobSearchService)
        {
            _jobSearchService = jobSearchService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<PaginatedResponse<JobPostingDto>>>> SearchJobs([FromQuery] JobFilterDto filter)
        {
            try
            {
                var result = await _jobSearchService.SearchJobsAsync(filter);
                return Ok(ApiResponse<PaginatedResponse<JobPostingDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<PaginatedResponse<JobPostingDto>>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{id:long}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<JobPostingDto>>> GetJobDetails(long id)
        {
            try
            {
                long? userId = User.Identity?.IsAuthenticated == true ? User.GetCurrentUserId() : null;
                var result = await _jobSearchService.GetJobDetailsAsync(id, userId);
                if (result == null)
                {
                    return NotFound(ApiResponse<JobPostingDto>.FailureResult("Job not found."));
                }
                return Ok(ApiResponse<JobPostingDto>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobPostingDto>.FailureResult(ex.Message));
            }
        }
    }
}
