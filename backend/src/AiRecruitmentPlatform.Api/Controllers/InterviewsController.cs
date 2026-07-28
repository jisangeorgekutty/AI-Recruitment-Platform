using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Api.Helpers;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Interviews;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/interviews")]
    [Authorize]
    public class InterviewsController : ControllerBase
    {
        private readonly IInterviewService _interviewService;

        public InterviewsController(IInterviewService interviewService)
        {
            _interviewService = interviewService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<InterviewSessionDto>>>> GetInterviews([FromQuery] long? jobId = null)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var userRole = User.FindFirst("role")?.Value ?? (User.IsInRole("Candidate") ? "candidate" : "recruiter");

                IEnumerable<InterviewSessionDto> interviews;
                if (string.Equals(userRole, "candidate", StringComparison.OrdinalIgnoreCase))
                {
                    interviews = await _interviewService.GetCandidateSessionsAsync(userId.ToString());
                }
                else
                {
                    interviews = await _interviewService.GetRecruiterSessionsAsync(userId.ToString(), jobId);
                }

                return Ok(ApiResponse<IEnumerable<InterviewSessionDto>>.SuccessResult(interviews));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<InterviewSessionDto>>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<ApiResponse<InterviewSessionDto>>> GetInterviewById(long id)
        {
            try
            {
                var session = await _interviewService.GetSessionByIdAsync(id);
                if (session == null)
                {
                    return NotFound(ApiResponse<InterviewSessionDto>.FailureResult("Interview session not found."));
                }
                return Ok(ApiResponse<InterviewSessionDto>.SuccessResult(session));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<InterviewSessionDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<InterviewSessionDto>>> CreateSession([FromBody] CreateInterviewSessionRequest request)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var session = await _interviewService.CreateSessionAsync(request, userId.ToString());
                return CreatedAtAction(nameof(GetInterviewById), new { id = session.Id }, ApiResponse<InterviewSessionDto>.SuccessResult(session, "Interview session created successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<InterviewSessionDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost("{id:long}/start")]
        public async Task<ActionResult<ApiResponse<InterviewSessionDto>>> StartSession(long id)
        {
            try
            {
                var session = await _interviewService.StartSessionAsync(id);
                return Ok(ApiResponse<InterviewSessionDto>.SuccessResult(session, "Interview screening session started."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<InterviewSessionDto>.FailureResult(ex.Message));
            }
        }

        [HttpPatch("{id:long}/cancel")]
        public async Task<ActionResult<ApiResponse<InterviewSessionDto>>> CancelSession(long id)
        {
            try
            {
                var session = await _interviewService.CancelSessionAsync(id);
                return Ok(ApiResponse<InterviewSessionDto>.SuccessResult(session, "Interview session cancelled successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<InterviewSessionDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost("{sessionId:long}/answers")]
        public async Task<ActionResult<ApiResponse<InterviewQuestionDto>>> SubmitAnswer(long sessionId, [FromBody] SubmitInterviewAnswerRequest request)
        {
            try
            {
                var question = await _interviewService.SubmitAnswerAsync(sessionId, request);
                return Ok(ApiResponse<InterviewQuestionDto>.SuccessResult(question, "Answer submitted and evaluated by AI successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<InterviewQuestionDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost("{sessionId:long}/generate-scorecard")]
        public async Task<ActionResult<ApiResponse<InterviewScorecardDto>>> GenerateScorecard(long sessionId)
        {
            try
            {
                var scorecard = await _interviewService.GenerateScorecardAsync(sessionId);
                return Ok(ApiResponse<InterviewScorecardDto>.SuccessResult(scorecard, "AI Candidate Scorecard generated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<InterviewScorecardDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{sessionId:long}/scorecard")]
        public async Task<ActionResult<ApiResponse<InterviewScorecardDto>>> GetScorecard(long sessionId)
        {
            try
            {
                var session = await _interviewService.GetSessionByIdAsync(sessionId);
                if (session == null) return NotFound(ApiResponse<InterviewScorecardDto>.FailureResult("Interview session not found."));
                if (session.Scorecard == null)
                {
                    var generatedScorecard = await _interviewService.GenerateScorecardAsync(sessionId);
                    return Ok(ApiResponse<InterviewScorecardDto>.SuccessResult(generatedScorecard));
                }
                return Ok(ApiResponse<InterviewScorecardDto>.SuccessResult(session.Scorecard));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<InterviewScorecardDto>.FailureResult(ex.Message));
            }
        }
    }
}
