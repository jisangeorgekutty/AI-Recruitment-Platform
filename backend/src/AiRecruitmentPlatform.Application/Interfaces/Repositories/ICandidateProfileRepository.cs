using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface ICandidateProfileRepository : IRepository<CandidateProfileInformation>
    {
        Task<CandidateProfileInformation?> GetFullProfileByUserIdAsync(long userId);
        Task<CandidateProfileInformation?> GetFullProfileByIdAsync(long profileInfoId);
    }
}
