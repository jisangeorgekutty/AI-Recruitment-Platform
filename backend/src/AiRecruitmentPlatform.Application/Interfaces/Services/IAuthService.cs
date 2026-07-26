using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Authentication;
using AiRecruitmentPlatform.Application.DTOs.Registration;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthenticationResponse> LoginAsync(AuthenticationRequest request);
        Task<RegistrationResponse> RegisterAsync(RegistrationRequest request);
        Task<RefreshTokenResponse> RefreshTokenAsync(RefreshTokenRequest request);
        Task<AuthenticationResponse> GoogleLoginAsync(GoogleAuthRequest request);
        Task LogoutAsync(long userId);
        Task<UserProfileResponse> GetProfileAsync(long userId);
        Task<UserProfileResponse> UpdateProfileAsync(long userId, UpdateProfileRequest request);
        Task ChangePasswordAsync(long userId, ChangePasswordRequest request);
        Task ForgotPasswordAsync(ForgotPasswordRequest request);
        Task ResetPasswordAsync(ResetPasswordRequest request);
        Task<UserProfileResponse> CompleteOnboardingAsync(long userId);
    }
}
