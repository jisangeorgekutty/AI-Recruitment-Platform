using System;

namespace AiRecruitmentPlatform.Application.DTOs.Admin
{
    public class AdminCompanyListDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Plan { get; set; } = "Free";
        public string Status { get; set; } = "pending"; // pending, verified, rejected, suspended
        public string Employees { get; set; } = "1-10";
        public int ActiveJobsCount { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
