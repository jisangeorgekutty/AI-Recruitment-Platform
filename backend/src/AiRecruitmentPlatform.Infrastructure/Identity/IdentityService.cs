using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Identity;

namespace AiRecruitmentPlatform.Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public IdentityService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<(string FirstName, string LastName, string Email, string Phone, string? AvatarUrl)?> GetUserBasicInfoAsync(long userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return null;
            return (user.FirstName ?? string.Empty, user.LastName ?? string.Empty, user.Email ?? string.Empty, user.PhoneNumber ?? string.Empty, user.AvatarUrl);
        }

        public async Task UpdateUserBasicInfoAsync(long userId, string? firstName, string? lastName, string? phone)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user != null)
            {
                user.FirstName = firstName ?? user.FirstName;
                user.LastName = lastName ?? user.LastName;
                user.PhoneNumber = phone ?? user.PhoneNumber;
                user.UpdatedAt = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);
            }
        }

        public async Task UpdateUserAvatarAsync(long userId, string avatarUrl)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new InvalidOperationException("User not found.");

            user.AvatarUrl = avatarUrl;
            user.UpdatedAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);
        }

        public async Task<bool> IsInRoleAsync(long userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user != null && await _userManager.IsInRoleAsync(user, roleName);
        }

        public async Task<List<string>> GetUserRolesAsync(long userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return new List<string>();
            var roles = await _userManager.GetRolesAsync(user);
            return roles.ToList();
        }

        public async Task AddToRoleAsync(long userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new InvalidOperationException("User not found.");
            await _userManager.AddToRoleAsync(user, roleName);
        }

        public async Task<List<long>> GetUserIdsInRoleAsync(string roleName)
        {
            var users = await _userManager.GetUsersInRoleAsync(roleName);
            return users.Select(u => u.Id).ToList();
        }

        public async Task<List<(long Id, string Name, string Email, string Role, string Joined, DateTime CreatedOn, string Status)>> GetAllUsersInfoAsync(string? search, string? role, string? status)
        {
            var allUsers = _userManager.Users.OrderByDescending(u => u.CreatedAt).ToList();
            var result = new List<(long Id, string Name, string Email, string Role, string Joined, DateTime CreatedOn, string Status)>();

            foreach (var user in allUsers)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userRole = roles.FirstOrDefault() ?? "candidate";
                var name = $"{user.FirstName} {user.LastName}".Trim();
                if (string.IsNullOrEmpty(name)) name = user.UserName ?? user.Email ?? "User";

                var userStatus = "active";
                var joined = user.CreatedAt.ToString("MMM yyyy");

                if (!string.IsNullOrWhiteSpace(search))
                {
                    var term = search.ToLower();
                    if (!name.ToLower().Contains(term) && !(user.Email ?? "").ToLower().Contains(term))
                        continue;
                }

                if (!string.IsNullOrWhiteSpace(role) && !userRole.Equals(role, StringComparison.OrdinalIgnoreCase))
                    continue;

                if (!string.IsNullOrWhiteSpace(status) && !userStatus.Equals(status, StringComparison.OrdinalIgnoreCase))
                    continue;

                result.Add((user.Id, name, user.Email ?? "", userRole, joined, user.CreatedAt, userStatus));
            }

            return result;
        }

        public async Task<List<(long Id, string Name, string Email, string Role, DateTime CreatedOn)>> GetRecentUsersAsync(int count)
        {
            var recent = _userManager.Users.OrderByDescending(u => u.CreatedAt).Take(count).ToList();
            var result = new List<(long Id, string Name, string Email, string Role, DateTime CreatedOn)>();

            foreach (var user in recent)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userRole = roles.FirstOrDefault() ?? "candidate";
                var name = $"{user.FirstName} {user.LastName}".Trim();
                if (string.IsNullOrEmpty(name)) name = user.UserName ?? user.Email ?? "User";

                result.Add((user.Id, name, user.Email ?? "", userRole, user.CreatedAt));
            }

            return result;
        }
    }
}
