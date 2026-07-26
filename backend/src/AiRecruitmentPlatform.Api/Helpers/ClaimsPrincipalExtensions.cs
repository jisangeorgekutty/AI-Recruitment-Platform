using System;
using System.Security.Claims;

namespace AiRecruitmentPlatform.Api.Helpers
{
    public static class ClaimsPrincipalExtensions
    {
        public static long GetCurrentUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? user.FindFirstValue("uid");
            if (!string.IsNullOrEmpty(userIdClaim) && long.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("User identity invalid or missing.");
        }
    }
}
