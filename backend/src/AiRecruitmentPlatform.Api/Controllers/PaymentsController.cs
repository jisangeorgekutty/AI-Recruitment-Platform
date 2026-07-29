using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Api.Helpers;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Payment;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create-checkout-session")]
        [Authorize(Roles = "recruiter,admin")]
        public async Task<ActionResult<ApiResponse<CheckoutSessionResponseDto>>> CreateCheckoutSession([FromBody] CreateCheckoutSessionDto dto)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var response = await _paymentService.CreateCheckoutSessionAsync(userId, dto);
                return Ok(ApiResponse<CheckoutSessionResponseDto>.SuccessResult(response, "Checkout session created successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CheckoutSessionResponseDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost("verify-session")]
        [Authorize(Roles = "recruiter,admin")]
        public async Task<ActionResult<ApiResponse<SubscriptionStatusDto>>> VerifySession([FromQuery] string sessionId)
        {
            try
            {
                var userId = User.GetCurrentUserId();
                if (string.IsNullOrEmpty(sessionId))
                {
                    return BadRequest(ApiResponse<SubscriptionStatusDto>.FailureResult("Session ID is required"));
                }

                var status = await _paymentService.VerifySessionAndActivateSubscriptionAsync(userId, sessionId);
                return Ok(ApiResponse<SubscriptionStatusDto>.SuccessResult(status, "Subscription verified and activated successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<SubscriptionStatusDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("current-subscription")]
        [Authorize(Roles = "recruiter,admin")]
        public async Task<ActionResult<ApiResponse<SubscriptionStatusDto>>> GetCurrentSubscription()
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var status = await _paymentService.GetCurrentSubscriptionAsync(userId);
                return Ok(ApiResponse<SubscriptionStatusDto>.SuccessResult(status));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<SubscriptionStatusDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("transactions")]
        [Authorize(Roles = "recruiter,admin")]
        public async Task<ActionResult<ApiResponse<IEnumerable<PaymentTransactionDto>>>> GetTransactions()
        {
            try
            {
                var userId = User.GetCurrentUserId();
                var transactions = await _paymentService.GetCompanyTransactionsAsync(userId);
                return Ok(ApiResponse<IEnumerable<PaymentTransactionDto>>.SuccessResult(transactions));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<IEnumerable<PaymentTransactionDto>>.FailureResult(ex.Message));
            }
        }

        [HttpPost("stripe-webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> StripeWebhook()
        {
            try
            {
                var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                var signatureHeader = Request.Headers["Stripe-Signature"];

                await _paymentService.ProcessStripeWebhookAsync(json, signatureHeader.ToString());
                return Ok(new { received = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
