using AiRecruitmentPlatform.Application.Constants;
using AiRecruitmentPlatform.Application.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Configurations
{
    public class RoleClaimConfiguration : IEntityTypeConfiguration<IdentityRoleClaim<long>>
    {
        public void Configure(EntityTypeBuilder<IdentityRoleClaim<long>> builder)
        {
            var claims = GetPermissions().Select(
                permission => new IdentityRoleClaim<long>
                {
                    Id = (int)permission.Id,
                    RoleId = 1,
                    ClaimType = CustomClaimTypes.Permission,
                    ClaimValue = permission.Name
                }).ToList();

            if (claims.Any())
            {
                builder.HasData(claims);
            }
        }

        private static IEnumerable<PermissionDto> GetPermissions()
        {
            var assemblyPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty;
            var filePath = Path.Combine(assemblyPath, "Data", "permissions.json");

            if (!File.Exists(filePath))
            {
                filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "permissions.json");
            }

            if (!File.Exists(filePath))
            {
                var infrastructurePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "AiRecruitmentPlatform.Infrastructure", "Data", "permissions.json");
                if (File.Exists(infrastructurePath))
                {
                    filePath = infrastructurePath;
                }
            }

            if (!File.Exists(filePath))
            {
                return new List<PermissionDto>();
            }

            try
            {
                var permissionsData = File.ReadAllText(filePath);
                if (string.IsNullOrWhiteSpace(permissionsData)) return new List<PermissionDto>();

                return JsonSerializer.Deserialize<List<PermissionDto>>(permissionsData,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<PermissionDto>();
            }
            catch
            {
                return new List<PermissionDto>();
            }
        }
    }
}
