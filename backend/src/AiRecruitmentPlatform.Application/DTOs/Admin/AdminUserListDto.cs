using System;

namespace AiRecruitmentPlatform.Application.DTOs.Admin
{
    public class AdminUserListDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Plan { get; set; } = "Free";
        public string Status { get; set; } = "active";
        public int JobsCount { get; set; }
        public string Joined { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
    }
}
