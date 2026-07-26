using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Job
{
    public class JobDepartmentStatDto
    {
        public string Department { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class JobStatsDto
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public int Draft { get; set; }
        public int Paused { get; set; }
        public int Closed { get; set; }
        public List<JobDepartmentStatDto> ByDepartment { get; set; } = new();
    }
}
