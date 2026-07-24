namespace AiRecruitmentPlatform.Application.Constants
{
    public class JwtSettings
    {
        public string Token { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public double AccessTokenExpirationMinutes { get; set; } = 60;
        public double RefreshTokenExpirationDays { get; set; } = 7;
    }
}
