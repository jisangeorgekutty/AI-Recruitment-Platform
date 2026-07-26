using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Api.Helpers;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/candidates")]
    [Authorize]
    public class CandidateController : ControllerBase
    {
        private readonly ICandidateManagementService _candidateService;

        public CandidateController(ICandidateManagementService candidateService)
        {
            _candidateService = candidateService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResponse<CandidateListDto>>>> GetCandidates(
            [FromQuery] string? search,
            [FromQuery] string? stage,
            [FromQuery] string? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _candidateService.GetCandidatesAsync(recruiterUserId, search, stage, status, page, pageSize);
                return Ok(ApiResponse<PaginatedResponse<CandidateListDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<PaginatedResponse<CandidateListDto>>.FailureResult(ex.Message));
            }
        }

        [HttpGet("pipeline")]
        public async Task<ActionResult<ApiResponse<Dictionary<string, List<CandidateListDto>>>>> GetPipeline([FromQuery] long? jobId)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _candidateService.GetCandidatePipelineAsync(recruiterUserId, jobId);
                return Ok(ApiResponse<Dictionary<string, List<CandidateListDto>>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<Dictionary<string, List<CandidateListDto>>>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<ApiResponse<CandidateListDto>>> GetCandidateById(long id)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _candidateService.GetCandidateByIdAsync(recruiterUserId, id);
                if (result == null)
                {
                    return NotFound(ApiResponse<CandidateListDto>.FailureResult("Candidate application not found."));
                }
                return Ok(ApiResponse<CandidateListDto>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateListDto>.FailureResult(ex.Message));
            }
        }

        [HttpPatch("{id:long}/stage")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateStage(long id, [FromBody] UpdateCandidateStageDto dto)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var success = await _candidateService.UpdateCandidateStageAsync(recruiterUserId, id, dto.Stage);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Candidate application not found."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Candidate stage updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }
    }
}
