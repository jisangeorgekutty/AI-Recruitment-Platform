using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Job;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Services
{
    public class AiJobMatchService : IAiJobMatchService
    {
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly ICandidateProfileRepository _candidateProfileRepository;
        private readonly IJobApplicationMatchScoreRepository _matchScoreRepository;
        private readonly IGeminiApiService _geminiApiService;

        public AiJobMatchService(
            IJobApplicationRepository jobApplicationRepository,
            IJobPostingRepository jobPostingRepository,
            ICandidateProfileRepository candidateProfileRepository,
            IJobApplicationMatchScoreRepository matchScoreRepository,
            IGeminiApiService geminiApiService)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _jobPostingRepository = jobPostingRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _matchScoreRepository = matchScoreRepository;
            _geminiApiService = geminiApiService;
        }

        public async Task<JobMatchResultDto> EvaluateApplicationMatchAsync(long recruiterUserId, long applicationId)
        {
            var application = await _jobApplicationRepository.Get(applicationId);
            if (application == null)
            {
                throw new KeyNotFoundException("Job application not found.");
            }

            var job = await _jobPostingRepository.GetJobPostingWithDetailsAsync(application.JobPostingId);
            if (job == null)
            {
                throw new KeyNotFoundException("Associated job posting not found.");
            }

            var profile = await _candidateProfileRepository.GetFullProfileByIdAsync(application.CandidateProfileId);
            if (profile == null)
            {
                throw new KeyNotFoundException("Candidate profile not found.");
            }

            // Extract Job Requirements
            var requiredSkills = job.Skills != null && job.Skills.Count > 0
                ? job.Skills.Select(s => s.SkillName).ToList()
                : new List<string>();
            var reqSkillsStr = requiredSkills.Count > 0 ? string.Join(", ", requiredSkills) : "General Software Development";

            // Extract Candidate Data
            var candidateSkills = profile.Skills != null && profile.Skills.Count > 0
                ? profile.Skills.Select(s => s.Name).ToList()
                : new List<string>();
            var candSkillsStr = candidateSkills.Count > 0 ? string.Join(", ", candidateSkills) : "N/A";

            var experiencesStr = profile.Experiences != null && profile.Experiences.Count > 0
                ? string.Join("; ", profile.Experiences.Select(e => $"{e.Title} at {e.Company} ({e.StartDate:yyyy} - {(e.IsCurrent ? "Present" : e.EndDate?.ToString("yyyy"))})"))
                : "No formal work history listed";

            var prompt = $@"You are an AI Job Matching & Skill Gap Analysis Engine for a professional hiring platform.
Evaluate the following candidate against the specified job posting requirements:

--- JOB POSTING REQUIREMENTS ---
- Title: {job.Title}
- Target Level/Experience: {job.ExperienceLevel ?? "Any"}
- Required Skills: {reqSkillsStr}
- Description Summary: {job.Description ?? "N/A"}

--- CANDIDATE PROFILE ---
- Candidate Title: {profile.CurrentTitle ?? "Applicant"}
- Target Role: {profile.TargetRole ?? "Professional"}
- Total Years Experience: {profile.YearsOfExperience} years
- Listed Skills: {candSkillsStr}
- Work Experience: {experiencesStr}
- Professional Summary: {profile.Summary ?? "N/A"}

Perform a detailed match scoring evaluation and return ONLY raw JSON (no markdown fences, no extra text):
{{
  ""overallMatchPercentage"": 88,
  ""skillMatchPercentage"": 85,
  ""experienceMatchPercentage"": 90,
  ""matchedSkills"": [""React"", ""TypeScript"", ""C#""],
  ""missingSkills"": [""Docker"", ""AWS""],
  ""candidateAiSummary"": ""Candidate has 5+ years of relevant experience building full-stack applications. Strong alignment with frontend & backend requirements, missing containerization experience."",
  ""recommendationFit"": ""Strong Fit""
}}
Note: recommendationFit MUST be strictly one of: ""Strong Fit"", ""Potential Fit"", or ""Low Fit"".";

            int overall = 75;
            int skillScore = 70;
            int expScore = 80;
            var matchedSkills = new List<string>();
            var missingSkills = new List<string>();
            string aiSummary = $"{profile.CurrentTitle ?? "Candidate"} has {profile.YearsOfExperience} years experience matching {job.Title}.";
            string recommendation = "Potential Fit";

            try
            {
                var rawAiResponse = await _geminiApiService.GenerateContentAsync(prompt);
                var cleanedJson = rawAiResponse.Replace("```json", "").Replace("```", "").Trim();

                using var doc = JsonDocument.Parse(cleanedJson);
                var root = doc.RootElement;

                if (root.TryGetProperty("overallMatchPercentage", out var oVal)) overall = Math.Clamp(oVal.GetInt32(), 0, 100);
                if (root.TryGetProperty("skillMatchPercentage", out var sVal)) skillScore = Math.Clamp(sVal.GetInt32(), 0, 100);
                if (root.TryGetProperty("experienceMatchPercentage", out var eVal)) expScore = Math.Clamp(eVal.GetInt32(), 0, 100);
                if (root.TryGetProperty("candidateAiSummary", out var sumVal) && !string.IsNullOrWhiteSpace(sumVal.GetString())) aiSummary = sumVal.GetString()!;
                if (root.TryGetProperty("recommendationFit", out var recVal) && !string.IsNullOrWhiteSpace(recVal.GetString())) recommendation = recVal.GetString()!;

                if (root.TryGetProperty("matchedSkills", out var mArr) && mArr.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in mArr.EnumerateArray())
                    {
                        var str = item.GetString();
                        if (!string.IsNullOrWhiteSpace(str)) matchedSkills.Add(str);
                    }
                }

                if (root.TryGetProperty("missingSkills", out var missArr) && missArr.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in missArr.EnumerateArray())
                    {
                        var str = item.GetString();
                        if (!string.IsNullOrWhiteSpace(str)) missingSkills.Add(str);
                    }
                }
            }
            catch
            {
                // Fallback deterministic skill match if AI parsing fails
                if (requiredSkills.Count > 0)
                {
                    matchedSkills = candidateSkills.Where(cs => requiredSkills.Any(rs => rs.Equals(cs, StringComparison.OrdinalIgnoreCase))).ToList();
                    missingSkills = requiredSkills.Where(rs => !candidateSkills.Any(cs => cs.Equals(rs, StringComparison.OrdinalIgnoreCase))).ToList();
                    skillScore = (int)Math.Round((double)matchedSkills.Count / requiredSkills.Count * 100);
                    overall = (int)Math.Round((skillScore * 0.6) + (expScore * 0.4));
                    recommendation = overall >= 80 ? "Strong Fit" : overall >= 60 ? "Potential Fit" : "Low Fit";
                }
            }

            // Save or Update Match Score in Database
            var existingScore = await _matchScoreRepository.GetByApplicationIdAsync(applicationId);
            if (existingScore != null)
            {
                existingScore.OverallMatchPercentage = overall;
                existingScore.SkillMatchPercentage = skillScore;
                existingScore.ExperienceMatchPercentage = expScore;
                existingScore.MatchedSkillsJson = JsonSerializer.Serialize(matchedSkills);
                existingScore.MissingSkillsJson = JsonSerializer.Serialize(missingSkills);
                existingScore.CandidateAiSummary = aiSummary;
                existingScore.RecommendationFit = recommendation;
                existingScore.EvaluatedAt = DateTime.UtcNow;

                await _matchScoreRepository.Update(existingScore);
            }
            else
            {
                existingScore = new JobApplicationMatchScore
                {
                    JobApplicationId = applicationId,
                    OverallMatchPercentage = overall,
                    SkillMatchPercentage = skillScore,
                    ExperienceMatchPercentage = expScore,
                    MatchedSkillsJson = JsonSerializer.Serialize(matchedSkills),
                    MissingSkillsJson = JsonSerializer.Serialize(missingSkills),
                    CandidateAiSummary = aiSummary,
                    RecommendationFit = recommendation,
                    EvaluatedAt = DateTime.UtcNow
                };

                await _matchScoreRepository.Add(existingScore);
            }

            await _matchScoreRepository.SaveChanges();

            return new JobMatchResultDto
            {
                Id = existingScore.Id,
                JobApplicationId = applicationId,
                JobPostingId = application.JobPostingId,
                CandidateProfileId = application.CandidateProfileId,
                OverallMatchPercentage = overall,
                SkillMatchPercentage = skillScore,
                ExperienceMatchPercentage = expScore,
                MatchedSkills = matchedSkills,
                MissingSkills = missingSkills,
                CandidateAiSummary = aiSummary,
                RecommendationFit = recommendation,
                EvaluatedAt = existingScore.EvaluatedAt
            };
        }

        public async Task<JobMatchResultDto?> GetApplicationMatchAsync(long recruiterUserId, long applicationId)
        {
            var existingScore = await _matchScoreRepository.GetByApplicationIdAsync(applicationId);
            if (existingScore == null)
            {
                return await EvaluateApplicationMatchAsync(recruiterUserId, applicationId);
            }

            var application = await _jobApplicationRepository.Get(applicationId);
            if (application == null) return null;

            var matchedSkills = new List<string>();
            var missingSkills = new List<string>();
            try
            {
                if (!string.IsNullOrWhiteSpace(existingScore.MatchedSkillsJson))
                    matchedSkills = JsonSerializer.Deserialize<List<string>>(existingScore.MatchedSkillsJson) ?? new List<string>();
                if (!string.IsNullOrWhiteSpace(existingScore.MissingSkillsJson))
                    missingSkills = JsonSerializer.Deserialize<List<string>>(existingScore.MissingSkillsJson) ?? new List<string>();
            }
            catch
            {
                // ignore JSON parse fallback
            }

            return new JobMatchResultDto
            {
                Id = existingScore.Id,
                JobApplicationId = existingScore.JobApplicationId,
                JobPostingId = application.JobPostingId,
                CandidateProfileId = application.CandidateProfileId,
                OverallMatchPercentage = existingScore.OverallMatchPercentage,
                SkillMatchPercentage = existingScore.SkillMatchPercentage,
                ExperienceMatchPercentage = existingScore.ExperienceMatchPercentage,
                MatchedSkills = matchedSkills,
                MissingSkills = missingSkills,
                CandidateAiSummary = existingScore.CandidateAiSummary,
                RecommendationFit = existingScore.RecommendationFit,
                EvaluatedAt = existingScore.EvaluatedAt
            };
        }

        public async Task<IEnumerable<JobMatchResultDto>> GetRankedMatchesForJobAsync(long recruiterUserId, long jobId)
        {
            var applications = await _jobApplicationRepository.GetJobApplicationsAsync(jobId);
            var results = new List<JobMatchResultDto>();

            foreach (var app in applications)
            {
                try
                {
                    var match = await GetApplicationMatchAsync(recruiterUserId, app.Id);
                    if (match != null)
                    {
                        results.Add(match);
                    }
                }
                catch
                {
                    // Continue with other applications if one fails
                }
            }

            return results.OrderByDescending(r => r.OverallMatchPercentage).ToList();
        }
    }
}
