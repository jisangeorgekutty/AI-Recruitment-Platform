namespace AiRecruitmentPlatform.Application.DTOs.Company
{
    public class UpdateCompanyProfileRequest
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string? Industry { get; set; }
        public string? CompanySize { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public int? EstablishedYear { get; set; }
        public string? RegistrationNumber { get; set; }
    }
}
