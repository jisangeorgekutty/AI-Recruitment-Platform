using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Job;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IJobOfferService
    {
        Task<JobOfferDto> CreateOfferAsync(long recruiterUserId, SendOfferDto dto);
        Task<IEnumerable<JobOfferDto>> GetMyOffersAsync(long candidateUserId);
        Task<JobOfferDto?> GetOfferByApplicationIdAsync(long applicationId);
        Task<bool> RespondToOfferAsync(long candidateUserId, long applicationId, string response);
    }
}
