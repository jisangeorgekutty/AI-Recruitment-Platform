namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class CandidateSkillDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Proficiency { get; set; }
    }
}
