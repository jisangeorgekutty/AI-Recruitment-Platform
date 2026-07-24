using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Authentication;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.DTOs.Registration;
using AiRecruitmentPlatform.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<AuthenticationResponse>>> Login([FromBody] AuthenticationRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                SetRefreshTokenCookie(response.RefreshToken, response.RefreshTokenExpiry);
                return Ok(ApiResponse<AuthenticationResponse>.SuccessResult(response, "Login successful"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<AuthenticationResponse>.FailureResult(ex.Message));
            }
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<RegistrationResponse>>> Register([FromBody] RegistrationRequest request)
        {
            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(ApiResponse<RegistrationResponse>.SuccessResult(response, "Registration successful"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<RegistrationResponse>.FailureResult(ex.Message));
            }
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<RefreshTokenResponse>>> RefreshToken([FromBody] RefreshTokenRequest? request)
        {
            try
            {
                var refreshToken = request?.RefreshToken;
                if (string.IsNullOrWhiteSpace(refreshToken))
                {
                    refreshToken = Request.Cookies["refreshToken"];
                }

                if (string.IsNullOrWhiteSpace(refreshToken))
                {
                    return BadRequest(ApiResponse<RefreshTokenResponse>.FailureResult("Refresh token is required."));
                }

                var response = await _authService.RefreshTokenAsync(new RefreshTokenRequest { RefreshToken = refreshToken });
                
                // Refresh token cookie is set for 7 days
                SetRefreshTokenCookie(response.RefreshToken, DateTime.UtcNow.AddDays(7));

                return Ok(ApiResponse<RefreshTokenResponse>.SuccessResult(response, "Token refreshed successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<RefreshTokenResponse>.FailureResult(ex.Message));
            }
        }

        [HttpPost("google")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<AuthenticationResponse>>> GoogleLogin([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var response = await _authService.GoogleLoginAsync(request);
                SetRefreshTokenCookie(response.RefreshToken, response.RefreshTokenExpiry);
                return Ok(ApiResponse<AuthenticationResponse>.SuccessResult(response, "Google authentication successful"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<AuthenticationResponse>.FailureResult(ex.Message));
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> Logout()
        {
            try
            {
                var userId = GetCurrentUserId();
                await _authService.LogoutAsync(userId);
                RemoveRefreshTokenCookie();
                return Ok(ApiResponse<string>.SuccessResult("Logged out", "Logout successful"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserProfileResponse>>> GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var response = await _authService.GetProfileAsync(userId);
                return Ok(ApiResponse<UserProfileResponse>.SuccessResult(response));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<UserProfileResponse>.FailureResult(ex.Message));
            }
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserProfileResponse>>> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var response = await _authService.UpdateProfileAsync(userId, request);
                return Ok(ApiResponse<UserProfileResponse>.SuccessResult(response, "Profile updated successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<UserProfileResponse>.FailureResult(ex.Message));
            }
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _authService.ChangePasswordAsync(userId, request);
                return Ok(ApiResponse<string>.SuccessResult("Password changed", "Password changed successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<string>>> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                await _authService.ForgotPasswordAsync(request);
                return Ok(ApiResponse<string>.SuccessResult("If an account exists, a password reset link has been sent.", "Password reset request processed"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<string>>> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                await _authService.ResetPasswordAsync(request);
                return Ok(ApiResponse<string>.SuccessResult("Password has been reset successfully.", "Password reset successful"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        #region Cookie Helpers

        private void SetRefreshTokenCookie(string refreshToken, DateTime? expires)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Secure in HTTPS production, works with localhost
                SameSite = SameSiteMode.Lax,
                Expires = expires ?? DateTime.UtcNow.AddDays(7),
                Path = "/api/auth"
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        private void RemoveRefreshTokenCookie()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Path = "/api/auth"
            };

            Response.Cookies.Delete("refreshToken", cookieOptions);
        }

        private long GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("uid");
            if (long.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            throw new InvalidOperationException("User identity invalid.");
        }

        #endregion
    }
}
