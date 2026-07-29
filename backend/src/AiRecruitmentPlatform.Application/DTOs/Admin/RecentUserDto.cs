using System;

namespace AiRecruitmentPlatform.Application.DTOs.Admin
{
    public class RecentUserDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Plan { get; set; } = "Free";
        public string Date { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
    }
}
