namespace AiRecruitmentPlatform.Application.DTOs.Registration
{
    public class RegistrationResponse
    {
        public long UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
