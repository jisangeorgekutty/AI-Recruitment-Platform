using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IJobApplicationMatchScoreRepository : IRepository<JobApplicationMatchScore>
    {
        Task<JobApplicationMatchScore?> GetByApplicationIdAsync(long applicationId);
    }
}
