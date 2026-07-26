using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Company;
using Microsoft.AspNetCore.Http;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface ICompanyProfileService
    {
        Task<CompanyProfileDto> GetCompanyProfileByUserIdAsync(long userId);
        Task<CompanyProfileDto> UpdateCompanyProfileAsync(long userId, UpdateCompanyProfileRequest request);
        Task<string?> UploadCompanyLogoAsync(long userId, IFormFile logoFile);
    }
}
