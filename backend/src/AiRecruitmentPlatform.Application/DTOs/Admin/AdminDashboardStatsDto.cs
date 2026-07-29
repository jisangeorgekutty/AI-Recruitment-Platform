namespace AiRecruitmentPlatform.Application.DTOs.Admin
{
    public class AdminDashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveCandidates { get; set; }
        public int ActiveRecruiters { get; set; }
        public int TotalCompanies { get; set; }
        public int PendingCompanyVerifications { get; set; }
        public int TotalActiveJobs { get; set; }
        public int TotalApplications { get; set; }
        public decimal TotalMonthlyRevenue { get; set; }
        public System.Collections.Generic.List<RecentUserDto> RecentUsers { get; set; } = new();
    }
}
