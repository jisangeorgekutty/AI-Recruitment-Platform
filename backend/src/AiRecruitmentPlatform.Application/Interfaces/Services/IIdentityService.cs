using System.Collections.Generic;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IIdentityService
    {
        Task<(string FirstName, string LastName, string Email, string Phone, string? AvatarUrl)?> GetUserBasicInfoAsync(long userId);
        Task UpdateUserBasicInfoAsync(long userId, string? firstName, string? lastName, string? phone);
        Task UpdateUserAvatarAsync(long userId, string avatarUrl);
        Task<bool> IsInRoleAsync(long userId, string roleName);
        Task<List<string>> GetUserRolesAsync(long userId);
        Task AddToRoleAsync(long userId, string roleName);
        Task<List<long>> GetUserIdsInRoleAsync(string roleName);
    }
}
