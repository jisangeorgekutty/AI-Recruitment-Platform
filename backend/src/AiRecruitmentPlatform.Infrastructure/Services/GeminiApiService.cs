using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Infrastructure.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AiRecruitmentPlatform.Infrastructure.Services
{
    public class GeminiApiService : IGeminiApiService
    {
        private readonly HttpClient _httpClient;
        private readonly GeminiSettings _settings;
        private readonly ILogger<GeminiApiService> _logger;

        public GeminiApiService(HttpClient httpClient, IOptions<GeminiSettings> options, ILogger<GeminiApiService> logger)
        {
            _httpClient = httpClient;
            _settings = options.Value;
            _logger = logger;
        }

        public async Task<string> GenerateContentAsync(string prompt)
        {
            if (string.IsNullOrWhiteSpace(_settings.ApiKey))
            {
                _logger.LogWarning("Gemini API Key is not configured.");
                throw new InvalidOperationException("Gemini API Key is missing in settings.");
            }

            var model = string.IsNullOrWhiteSpace(_settings.Model) ? "gemini-flash-latest" : _settings.Model;
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={_settings.ApiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(url, jsonContent);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Gemini API error ({StatusCode}): {Response}", response.StatusCode, responseString);
                    throw new InvalidOperationException($"Gemini API error: {response.StatusCode}");
                }

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;

                if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                {
                    var firstCandidate = candidates[0];
                    if (firstCandidate.TryGetProperty("content", out var content) &&
                        content.TryGetProperty("parts", out var parts) && parts.GetArrayLength() > 0)
                    {
                        var text = parts[0].GetProperty("text").GetString();
                        return text ?? string.Empty;
                    }
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to invoke Gemini API");
                throw;
            }
        }
    }
}
