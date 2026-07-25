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
    }
}
