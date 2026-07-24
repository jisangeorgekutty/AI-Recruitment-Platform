namespace AiRecruitmentPlatform.Application.DTOs.Registration
{
    public class RegistrationRequest
    {
        public string? Name { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "candidate"; // candidate or recruiter or admin
        public string? CompanyName { get; set; }
    }
}
