namespace AiRecruitmentPlatform.Application.DTOs.Analytics
{
    public class DashboardStatsDto
    {
        public int TotalJobs { get; set; }
        public int ActiveJobs { get; set; }
        public int TotalCandidates { get; set; }
        public int TotalInterviews { get; set; }
        public int InterviewsThisWeek { get; set; }
        public int OffersSent { get; set; }
        public double AcceptanceRate { get; set; }
        public int TimeToHire { get; set; }
        public int ApplicationsThisMonth { get; set; }
        public int CandidatesHired { get; set; }
        public decimal RevenueImpact { get; set; }
    }
}
