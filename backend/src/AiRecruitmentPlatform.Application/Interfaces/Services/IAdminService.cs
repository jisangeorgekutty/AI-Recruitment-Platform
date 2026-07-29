using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Admin;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IAdminService
    {
        Task<AdminDashboardStatsDto> GetAdminDashboardStatsAsync();
        Task<IReadOnlyList<AdminUserListDto>> GetUsersAsync(string? search, string? role, string? status);
        Task<bool> UpdateUserStatusAsync(long userId, string status);
        Task<bool> UpdateUserRoleAsync(long userId, string newRole);
        Task<IReadOnlyList<AdminCompanyListDto>> GetCompaniesAsync(string? search, string? status);
        Task<bool> UpdateCompanyStatusAsync(long companyId, string status);
        Task<IReadOnlyList<AdminPaymentDto>> GetAdminPaymentsAsync(string? search);
    }
}
