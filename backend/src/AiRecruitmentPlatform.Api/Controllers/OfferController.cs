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
    [Route("api/offers")]
    [Authorize]
    public class OfferController : ControllerBase
    {
        private readonly IJobOfferService _offerService;

        public OfferController(IJobOfferService offerService)
        {
            _offerService = offerService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<JobOfferDto>>> CreateOffer([FromBody] SendOfferDto dto)
        {
            try
            {
                var recruiterUserId = User.GetCurrentUserId();
                var result = await _offerService.CreateOfferAsync(recruiterUserId, dto);
                return Ok(ApiResponse<JobOfferDto>.SuccessResult(result, "Offer letter generated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobOfferDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("my-offers")]
        public async Task<ActionResult<ApiResponse<IEnumerable<JobOfferDto>>>> GetMyOffers()
        {
            try
            {
                var candidateUserId = User.GetCurrentUserId();
                var results = await _offerService.GetMyOffersAsync(candidateUserId);
                return Ok(ApiResponse<IEnumerable<JobOfferDto>>.SuccessResult(results));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<JobOfferDto>>.FailureResult(ex.Message));
            }
        }

        [HttpGet("application/{applicationId:long}")]
        public async Task<ActionResult<ApiResponse<JobOfferDto>>> GetOfferByApplicationId(long applicationId)
        {
            try
            {
                var result = await _offerService.GetOfferByApplicationIdAsync(applicationId);
                if (result == null)
                {
                    return NotFound(ApiResponse<JobOfferDto>.FailureResult("No offer found for this application."));
                }
                return Ok(ApiResponse<JobOfferDto>.SuccessResult(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<JobOfferDto>.FailureResult(ex.Message));
            }
        }

        [HttpPatch("{applicationId:long}/respond")]
        public async Task<ActionResult<ApiResponse<bool>>> RespondToOffer(long applicationId, [FromBody] OfferResponseDto dto)
        {
            try
            {
                var candidateUserId = User.GetCurrentUserId();
                var success = await _offerService.RespondToOfferAsync(candidateUserId, applicationId, dto.Response);
                if (!success)
                {
                    return NotFound(ApiResponse<bool>.FailureResult("Offer not found or unauthorized."));
                }
                return Ok(ApiResponse<bool>.SuccessResult(true, $"Offer {dto.Response.ToLowerInvariant()} successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<bool>.FailureResult(ex.Message));
            }
        }
    }
}
