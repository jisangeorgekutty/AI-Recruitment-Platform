namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class UpdateCandidatePersonalInfoRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? CurrentTitle { get; set; }
        public string? Location { get; set; }
        public string? Summary { get; set; }
        public int YearsOfExperience { get; set; }
    }
}
