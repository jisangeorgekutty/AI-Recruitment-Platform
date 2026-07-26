using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IGeminiApiService
    {
        Task<string> GenerateContentAsync(string prompt);
    }
}
