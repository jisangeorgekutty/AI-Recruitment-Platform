using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface ICompanyProfileRepository : IRepository<CompanyProfile>
    {
        Task<CompanyProfile?> GetByUserIdAsync(long userId);
    }
}
