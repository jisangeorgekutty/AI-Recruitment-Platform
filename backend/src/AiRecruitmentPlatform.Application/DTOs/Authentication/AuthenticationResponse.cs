using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Authentication
{
    public class AuthenticationResponse
    {
        public UserProfileResponse User { get; set; } = default!;
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime? RefreshTokenExpiry { get; set; }
        public List<string>? Permissions { get; set; }
    }
}
