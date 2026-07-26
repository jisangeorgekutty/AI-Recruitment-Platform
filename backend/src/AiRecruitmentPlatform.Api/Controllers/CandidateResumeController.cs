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
    [Route("api/candidate-resumes")]
    [Authorize]
    public class CandidateResumeController : ControllerBase
    {
        private readonly ICandidateResumeService _resumeService;
        private readonly IAiResumeAnalysisService _aiAnalysisService;

        public CandidateResumeController(ICandidateResumeService resumeService, IAiResumeAnalysisService aiAnalysisService)
        {
            _resumeService = resumeService;
            _aiAnalysisService = aiAnalysisService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<CandidateResumeDto>>> UploadResume([FromForm] UploadResumeDto dto)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var result = await _resumeService.UploadResumeAsync(userId, dto);
                return Ok(ApiResponse<CandidateResumeDto>.SuccessResult(result, "Resume uploaded successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateResumeDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<CandidateResumeDto>>>> GetMyResumes()
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var result = await _resumeService.GetMyResumesAsync(userId);
                return Ok(ApiResponse<IEnumerable<CandidateResumeDto>>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<CandidateResumeDto>>.FailureResult(ex.Message));
            }
        }

        [HttpPost("{id:long}/primary")]
        public async Task<ActionResult<ApiResponse<bool>>> SetPrimary(long id)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var success = await _resumeService.SetPrimaryResumeAsync(userId, id);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Resume not found."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Primary resume updated."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("{id:long}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteResume(long id)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var success = await _resumeService.DeleteResumeAsync(userId, id);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Resume not found."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, "Resume deleted successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }

        [HttpPost("{id:long}/analyze-ats")]
        public async Task<ActionResult<ApiResponse<ResumeAtsAnalysisDto>>> AnalyzeAts(long id)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var result = await _aiAnalysisService.AnalyzeResumeAsync(userId, id);
                return Ok(ApiResponse<ResumeAtsAnalysisDto>.SuccessResult(result, "AI ATS Analysis completed successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<ResumeAtsAnalysisDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{id:long}/ats-analysis")]
        public async Task<ActionResult<ApiResponse<ResumeAtsAnalysisDto>>> GetAtsAnalysis(long id)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var result = await _aiAnalysisService.GetLatestAnalysisAsync(userId, id);
                if (result == null)
                {
                    return NotFound(ApiResponse<ResumeAtsAnalysisDto>.FailureResult("No ATS analysis found for this resume."));
                }
                return Ok(ApiResponse<ResumeAtsAnalysisDto>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<ResumeAtsAnalysisDto>.FailureResult(ex.Message));
            }
        }
    }
}
