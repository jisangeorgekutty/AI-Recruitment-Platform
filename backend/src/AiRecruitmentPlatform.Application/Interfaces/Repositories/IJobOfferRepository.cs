using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IJobOfferRepository : IRepository<JobOffer>
    {
        Task<JobOffer?> GetByApplicationIdAsync(long applicationId);
        Task<IEnumerable<JobOffer>> GetOffersByCandidateProfileIdAsync(long candidateProfileId);
    }
}
