using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Interfaces.Repositories
{
    public interface IRecruiterParsedResumeRepository : IRepository<RecruiterParsedResume>
    {
        Task<IEnumerable<RecruiterParsedResume>> GetByCompanyIdAsync(long companyProfileId);
        Task<RecruiterParsedResume?> GetByIdAndCompanyAsync(long id, long companyProfileId);
    }
}
