using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Constants;
using AiRecruitmentPlatform.Application.DTOs.Authentication;
using AiRecruitmentPlatform.Application.DTOs.Framework;
using AiRecruitmentPlatform.Application.DTOs.Registration;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Infrastructure.Identity.Models;
using AiRecruitmentPlatform.Infrastructure.Persistence;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MimeKit;

namespace AiRecruitmentPlatform.Infrastructure.Identity
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<long>> _roleManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<long>> roleManager,
            ApplicationDbContext dbContext,
            IConfiguration configuration,
            IEmailService emailService,
            ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _dbContext = dbContext;
            _configuration = configuration;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<AuthenticationResponse> LoginAsync(AuthenticationRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email ?? string.Empty);
            if (user == null)
            {
                throw new InvalidOperationException("Invalid credentials.");
            }

            var result = await _userManager.CheckPasswordAsync(user, request.Password ?? string.Empty);
            if (!result)
            {
                throw new InvalidOperationException("Invalid credentials.");
            }

            return await GenerateAuthenticationResponseAsync(user);
        }

        public async Task<RegistrationResponse> RegisterAsync(RegistrationRequest request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException($"Email '{request.Email}' is already registered.");
            }

            var backendRole = MapRoleFromFrontend(request.Role);
            if (!await _roleManager.RoleExistsAsync(backendRole))
            {
                throw new InvalidOperationException($"Role '{request.Role}' does not exist.");
            }

            string firstName = request.FirstName ?? string.Empty;
            string lastName = request.LastName ?? string.Empty;

            if (!string.IsNullOrWhiteSpace(request.Name) && string.IsNullOrWhiteSpace(firstName))
            {
                var nameParts = request.Name.Trim().Split(' ', 2);
                firstName = nameParts[0];
                lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = firstName,
                LastName = lastName,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Registration failed: {errors}");
            }

            await _userManager.AddToRoleAsync(user, backendRole);

            // Send Welcome Email
            try
            {
                await _emailService.Send(new MessageDto
                {
                    To = new List<MailboxAddress> { new MailboxAddress($"{user.FirstName} {user.LastName}".Trim(), user.Email) },
                    Subject = "Welcome to AI Recruitment Platform",
                    Content = $"<h1>Welcome {user.FirstName}!</h1><p>Thank you for registering on the AI Recruitment Platform as a {MapRoleToFrontend(backendRole)}.</p>"
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send welcome email to {Email}", user.Email);
            }

            return new RegistrationResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Message = "Registration successful."
            };
        }

        public async Task<RefreshTokenResponse> RefreshTokenAsync(RefreshTokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                throw new InvalidOperationException("Refresh token is required.");
            }

            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

            if (user == null || user.RefreshTokenExpiry == null || user.RefreshTokenExpiry <= DateTime.UtcNow)
            {
                throw new InvalidOperationException("Invalid or expired refresh token.");
            }

            var newAccessToken = await GenerateJwtTokenAsync(user);
            var newRefreshToken = GenerateRefreshToken();

            var refreshExpiryDays = Convert.ToDouble(_configuration["AppSettings:RefreshTokenExpirationDays"] ?? "7");
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(refreshExpiryDays);
            user.UpdatedAt = DateTime.UtcNow;

            await _userManager.UpdateAsync(user);

            return new RefreshTokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        public async Task<AuthenticationResponse> GoogleLoginAsync(GoogleAuthRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.IdToken))
            {
                throw new InvalidOperationException("Google ID Token is required.");
            }

            GoogleJsonWebSignature.Payload payload;
            try
            {
                var googleClientId = _configuration["Authentication:Google:ClientId"];
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings();
                if (!string.IsNullOrWhiteSpace(googleClientId))
                {
                    validationSettings.Audience = new[] { googleClientId };
                }

                payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, validationSettings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Google token validation failed.");
                throw new InvalidOperationException("Invalid Google token.");
            }

            var user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                var role = MapRoleFromFrontend(request.Role ?? "candidate");
                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    FirstName = payload.GivenName ?? payload.Name ?? "Google",
                    LastName = payload.FamilyName ?? "User",
                    AvatarUrl = payload.Picture,
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Google registration failed: {errors}");
                }

                await _userManager.AddToRoleAsync(user, role);
            }

            return await GenerateAuthenticationResponseAsync(user);
        }

        public async Task LogoutAsync(long userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiry = null;
                user.UpdatedAt = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);
            }
        }

        public async Task<UserProfileResponse> GetProfileAsync(long userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            return await BuildUserProfileResponseAsync(user);
        }

        public async Task<UserProfileResponse> UpdateProfileAsync(long userId, UpdateProfileRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            if (!string.IsNullOrWhiteSpace(request.FirstName))
            {
                user.FirstName = request.FirstName.Trim();
            }

            if (request.LastName != null)
            {
                user.LastName = request.LastName.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.Name) && string.IsNullOrWhiteSpace(request.FirstName))
            {
                var parts = request.Name.Trim().Split(' ', 2);
                user.FirstName = parts[0];
                user.LastName = parts.Length > 1 ? parts[1] : string.Empty;
            }

            if (request.Avatar != null)
            {
                user.AvatarUrl = request.Avatar;
            }

            user.UpdatedAt = DateTime.UtcNow;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Profile update failed: {errors}");
            }

            return await BuildUserProfileResponseAsync(user);
        }


        public async Task ChangePasswordAsync(long userId, ChangePasswordRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Password change failed: {errors}");
            }
        }

        public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // Return silently to prevent user enumeration
                return;
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email!)}";

            try
            {
                await _emailService.Send(new MessageDto
                {
                    To = new List<MailboxAddress> { new MailboxAddress($"{user.FirstName} {user.LastName}".Trim(), user.Email!) },
                    Subject = "Reset Your Password - AI Recruitment Platform",
                    Content = $"<p>Click <a href='{resetLink}'>here</a> to reset your password.</p>"
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send password reset email to {Email}", user.Email);
            }
        }

        public async Task ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Password reset failed: {errors}");
            }
        }

        #region Helpers

        private async Task<AuthenticationResponse> GenerateAuthenticationResponseAsync(ApplicationUser user)
        {
            var accessToken = await GenerateJwtTokenAsync(user);
            var refreshToken = GenerateRefreshToken();

            var refreshExpiryDays = Convert.ToDouble(_configuration["AppSettings:RefreshTokenExpirationDays"] ?? "7");
            var refreshExpiry = DateTime.UtcNow.AddDays(refreshExpiryDays);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = refreshExpiry;
            user.UpdatedAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            var profile = await BuildUserProfileResponseAsync(user);
            var userRoles = await _userManager.GetRolesAsync(user);
            var permissions = await GetPermissionsForUserAsync(userRoles);

            return new AuthenticationResponse
            {
                User = profile,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                RefreshTokenExpiry = refreshExpiry,
                Permissions = permissions
            };
        }

        private async Task<string> GenerateJwtTokenAsync(ApplicationUser user)
        {
            var secretKey = _configuration["AppSettings:Token"] ?? throw new InvalidOperationException("JWT Secret Token is not configured.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(CustomClaimTypes.Uid, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, MapRoleToFrontend(role)));
            }

            var permissions = await GetPermissionsForUserAsync(roles);
            foreach (var permission in permissions)
            {
                claims.Add(new Claim(CustomClaimTypes.Permission, permission));
            }

            var expirationMinutes = Convert.ToDouble(_configuration["AppSettings:AccessTokenExpirationMinutes"] ?? "60");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Issuer = _configuration["AppSettings:Issuer"],
                Audience = _configuration["AppSettings:Audience"],
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<UserProfileResponse> BuildUserProfileResponseAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var primaryRole = roles.FirstOrDefault() ?? "Candidate";

            return new UserProfileResponse
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Name = $"{user.FirstName} {user.LastName}".Trim(),
                Avatar = user.AvatarUrl,
                Role = MapRoleToFrontend(primaryRole),
                CompanyId = user.CompanyId,
                IsOnboardingCompleted = user.IsOnboardingCompleted,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }

        public async Task<UserProfileResponse> CompleteOnboardingAsync(long userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            user.IsOnboardingCompleted = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            return await BuildUserProfileResponseAsync(user);
        }

        private async Task<List<string>> GetPermissionsForUserAsync(IList<string> roles)
        {
            var permissions = new List<string>();
            foreach (var roleName in roles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    var roleClaims = await _roleManager.GetClaimsAsync(role);
                    permissions.AddRange(roleClaims
                        .Where(c => c.Type == CustomClaimTypes.Permission && !string.IsNullOrWhiteSpace(c.Value))
                        .Select(c => c.Value));
                }
            }
            return permissions.Distinct().ToList();
        }

        private static string MapRoleFromFrontend(string? role)
        {
            if (string.IsNullOrWhiteSpace(role)) return "Candidate";

            return role.ToLowerInvariant() switch
            {
                "admin" => "Super Administrator",
                "super administrator" => "Super Administrator",
                "recruiter" => "Recruiter",
                "candidate" => "Candidate",
                _ => "Candidate"
            };
        }

        private static string MapRoleToFrontend(string? role)
        {
            if (string.IsNullOrWhiteSpace(role)) return "candidate";

            return role switch
            {
                "Super Administrator" => "admin",
                "Recruiter" => "recruiter",
                "Candidate" => "candidate",
                _ => role.ToLowerInvariant()
            };
        }

        #endregion
    }
}
