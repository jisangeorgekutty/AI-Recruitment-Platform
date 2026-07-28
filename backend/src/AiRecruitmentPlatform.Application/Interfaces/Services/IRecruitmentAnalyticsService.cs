using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Analytics;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IRecruitmentAnalyticsService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync(long userId);
        Task<IReadOnlyList<HiringFunnelDto>> GetHiringFunnelAsync(long userId);
        Task<IReadOnlyList<TimeToHireDto>> GetTimeToHireAsync(long userId);
        Task<IReadOnlyList<SourceBreakdownDto>> GetSourceBreakdownAsync(long userId);
        Task<IReadOnlyList<DiversityMetricsDto>> GetDiversityMetricsAsync(long userId);
        Task<IReadOnlyList<RecentActivityDto>> GetRecentActivityAsync(long userId, int limit);
    }
}
