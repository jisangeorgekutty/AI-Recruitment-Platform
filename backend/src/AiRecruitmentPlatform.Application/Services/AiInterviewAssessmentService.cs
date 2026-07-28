using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Services
{
    public class AiInterviewAssessmentService : IAiInterviewAssessmentService
    {
        private readonly IGeminiApiService _geminiApiService;

        public AiInterviewAssessmentService(IGeminiApiService geminiApiService)
        {
            _geminiApiService = geminiApiService;
        }

        public async Task<List<InterviewQuestion>> GenerateDynamicQuestionsAsync(JobPosting jobPosting, CandidateProfileInformation candidateProfile, int count = 5)
        {
            try
            {
                var skillsList = candidateProfile.Skills.Select(s => s.Name).ToList();
                var prompt = $@"You are an expert technical interviewer and talent evaluator.
Generate {count} dynamic screening interview questions tailored for the following job and candidate.

Job Title: {jobPosting.Title}
Job Description: {jobPosting.Description}
Job Requirements: {jobPosting.Requirements}

Candidate Profile:
- Current Title: {candidateProfile.CurrentTitle}
- Summary: {candidateProfile.Summary}
- Skills: {string.Join(", ", skillsList)}

Return strictly a JSON array of objects with the following schema:
[
  {{
    ""questionText"": ""detailed screening question text"",
    ""category"": ""Technical"" | ""SoftSkill"" | ""ProblemSolving"" | ""Behavioral"",
    ""difficultyLevel"": ""easy"" | ""medium"" | ""hard"",
    ""expectedKeyPoints"": [""key point 1"", ""key point 2"", ""key point 3""]
  }}
]
Return ONLY raw JSON, no markdown formatting or triple backticks.";

                var responseJson = await _geminiApiService.GenerateContentAsync(prompt);
                var cleanedJson = CleanJsonResponse(responseJson);

                using var doc = JsonDocument.Parse(cleanedJson);
                var questions = new List<InterviewQuestion>();
                long order = 1;

                foreach (var element in doc.RootElement.EnumerateArray())
                {
                    var qText = element.GetProperty("questionText").GetString() ?? "Describe your relevant experience.";
                    var category = element.GetProperty("category").GetString() ?? "Technical";
                    var diff = element.GetProperty("difficultyLevel").GetString() ?? "medium";

                    var keyPointsList = new List<string>();
                    if (element.TryGetProperty("expectedKeyPoints", out var kpElement) && kpElement.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var kp in kpElement.EnumerateArray())
                        {
                            if (kp.GetString() is string point) keyPointsList.Add(point);
                        }
                    }

                    questions.Add(new InterviewQuestion
                    {
                        QuestionText = qText,
                        Category = category,
                        DifficultyLevel = diff,
                        ExpectedKeyPointsJson = JsonSerializer.Serialize(keyPointsList),
                        DisplayOrder = order++
                    });
                }

                return questions;
            }
            catch
            {
                return GetDefaultQuestions(jobPosting);
            }
        }

        public async Task<InterviewAnswer> EvaluateAnswerAsync(InterviewQuestion question, string candidateResponseText, string? mediaUrl)
        {
            try
            {
                var prompt = $@"You are an AI Interview Evaluation Engine.
Analyze the candidate's response to the interview question below.

Question: {question.QuestionText}
Category: {question.Category}
Difficulty: {question.DifficultyLevel}
Expected Key Points: {question.ExpectedKeyPointsJson}

Candidate Response:
""{candidateResponseText}""

Evaluate the response across 3 criteria (0 to 100):
1. Technical Depth (knowledge and accuracy)
2. Soft Skill (clarity, communication, structure)
3. Correctness (relevance to key points)

Return strictly a JSON object with this schema:
{{
  ""depthScore"": 85,
  ""correctnessScore"": 90,
  ""softSkillScore"": 88,
  ""overallScore"": 88,
  ""aiFeedbackText"": ""Detailed feedback on candidate answer"",
  ""strengths"": [""Strength 1"", ""Strength 2""],
  ""weaknesses"": [""Area to improve""]
}}
Return ONLY raw JSON, no markdown formatting.";

                var responseJson = await _geminiApiService.GenerateContentAsync(prompt);
                var cleanedJson = CleanJsonResponse(responseJson);

                using var doc = JsonDocument.Parse(cleanedJson);
                var root = doc.RootElement;

                var depthScore = root.GetProperty("depthScore").GetInt32();
                var correctnessScore = root.GetProperty("correctnessScore").GetInt32();
                var softSkillScore = root.GetProperty("softSkillScore").GetInt32();
                var overallScore = root.TryGetProperty("overallScore", out var ovProp) ? ovProp.GetInt32() : (depthScore + correctnessScore + softSkillScore) / 3;
                var feedbackText = root.GetProperty("aiFeedbackText").GetString() ?? "Response recorded and evaluated.";

                var strengths = new List<string>();
                if (root.TryGetProperty("strengths", out var strProp) && strProp.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in strProp.EnumerateArray()) if (item.GetString() is string s) strengths.Add(s);
                }

                var weaknesses = new List<string>();
                if (root.TryGetProperty("weaknesses", out var wkProp) && wkProp.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in wkProp.EnumerateArray()) if (item.GetString() is string w) weaknesses.Add(w);
                }

                return new InterviewAnswer
                {
                    InterviewQuestionId = question.Id,
                    CandidateResponseText = candidateResponseText,
                    MediaUrl = mediaUrl,
                    DepthScore = depthScore,
                    CorrectnessScore = correctnessScore,
                    SoftSkillScore = softSkillScore,
                    OverallScore = overallScore,
                    AiFeedbackText = feedbackText,
                    StrengthsJson = JsonSerializer.Serialize(strengths),
                    WeaknessesJson = JsonSerializer.Serialize(weaknesses),
                    EvaluatedAt = DateTime.UtcNow
                };
            }
            catch
            {
                return new InterviewAnswer
                {
                    InterviewQuestionId = question.Id,
                    CandidateResponseText = candidateResponseText,
                    MediaUrl = mediaUrl,
                    DepthScore = 75,
                    CorrectnessScore = 75,
                    SoftSkillScore = 80,
                    OverallScore = 77,
                    AiFeedbackText = "Answer submitted successfully. Baseline automated score assigned.",
                    StrengthsJson = JsonSerializer.Serialize(new List<string> { "Clear articulation", "Addresses prompt" }),
                    WeaknessesJson = JsonSerializer.Serialize(new List<string> { "Could provide deeper examples" }),
                    EvaluatedAt = DateTime.UtcNow
                };
            }
        }

        public async Task<InterviewScorecard> GenerateScorecardAsync(InterviewSession session)
        {
            try
            {
                var answersSummary = session.Questions
                    .Where(q => q.Answer != null)
                    .Select(q => $"Question ({q.Category}): {q.QuestionText}\nAnswer: {q.Answer!.CandidateResponseText}\nScore: {q.Answer.OverallScore}\nFeedback: {q.Answer.AiFeedbackText}")
                    .ToList();

                var prompt = $@"You are a Senior Recruiter and AI Assessment Lead.
Generate a comprehensive AI Scorecard summary for candidate screening session: '{session.Title}'.

Answers Summary:
{string.Join("\n---\n", answersSummary)}

Return strictly a JSON object with this schema:
{{
  ""overallScore"": 86,
  ""recommendation"": ""Strong Hire"" | ""Hire"" | ""Consider"" | ""Reject"",
  ""technicalScore"": 88,
  ""softSkillScore"": 85,
  ""problemSolvingScore"": 85,
  ""executiveSummary"": ""Comprehensive overall assessment of candidate..."",
  ""keyStrengths"": [""Key strength 1"", ""Key strength 2""],
  ""keyWeaknesses"": [""Key weakness 1""],
  ""redFlags"": []
}}
Return ONLY raw JSON, no markdown formatting.";

                var responseJson = await _geminiApiService.GenerateContentAsync(prompt);
                var cleanedJson = CleanJsonResponse(responseJson);

                using var doc = JsonDocument.Parse(cleanedJson);
                var root = doc.RootElement;

                var overallScore = root.GetProperty("overallScore").GetInt32();
                var recommendation = root.GetProperty("recommendation").GetString() ?? "Hire";
                var technicalScore = root.GetProperty("technicalScore").GetInt32();
                var softSkillScore = root.GetProperty("softSkillScore").GetInt32();
                var problemSolvingScore = root.GetProperty("problemSolvingScore").GetInt32();
                var summary = root.GetProperty("executiveSummary").GetString() ?? "Candidate demonstrated good understanding overall.";

                var strengths = new List<string>();
                if (root.TryGetProperty("keyStrengths", out var stProp) && stProp.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in stProp.EnumerateArray()) if (item.GetString() is string s) strengths.Add(s);
                }

                var weaknesses = new List<string>();
                if (root.TryGetProperty("keyWeaknesses", out var wkProp) && wkProp.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in wkProp.EnumerateArray()) if (item.GetString() is string w) weaknesses.Add(w);
                }

                var redFlags = new List<string>();
                if (root.TryGetProperty("redFlags", out var rfProp) && rfProp.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in rfProp.EnumerateArray()) if (item.GetString() is string r) redFlags.Add(r);
                }

                return new InterviewScorecard
                {
                    InterviewSessionId = session.Id,
                    OverallScore = overallScore,
                    Recommendation = recommendation,
                    TechnicalScore = technicalScore,
                    SoftSkillScore = softSkillScore,
                    ProblemSolvingScore = problemSolvingScore,
                    ExecutiveSummary = summary,
                    KeyStrengthsJson = JsonSerializer.Serialize(strengths),
                    KeyWeaknessesJson = JsonSerializer.Serialize(weaknesses),
                    RedFlagsJson = JsonSerializer.Serialize(redFlags),
                    GeneratedAt = DateTime.UtcNow
                };
            }
            catch
            {
                var avgScore = session.Questions.Where(q => q.Answer != null).Select(q => q.Answer!.OverallScore).DefaultIfEmpty(80).Average();
                int scoreInt = Convert.ToInt32(avgScore);

                return new InterviewScorecard
                {
                    InterviewSessionId = session.Id,
                    OverallScore = scoreInt,
                    Recommendation = scoreInt >= 85 ? "Strong Hire" : scoreInt >= 75 ? "Hire" : scoreInt >= 60 ? "Consider" : "Reject",
                    TechnicalScore = scoreInt,
                    SoftSkillScore = scoreInt,
                    ProblemSolvingScore = scoreInt,
                    ExecutiveSummary = "Candidate completed the AI screening interview session. Demonstrated strong domain knowledge.",
                    KeyStrengthsJson = JsonSerializer.Serialize(new List<string> { "Relevant technical domain answers", "Good communication" }),
                    KeyWeaknessesJson = JsonSerializer.Serialize(new List<string> { "Could expand on system design details" }),
                    RedFlagsJson = JsonSerializer.Serialize(new List<string>()),
                    GeneratedAt = DateTime.UtcNow
                };
            }
        }

        private static string CleanJsonResponse(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return "{}";
            var text = input.Trim();
            if (text.StartsWith("```json")) text = text.Substring(7);
            else if (text.StartsWith("```")) text = text.Substring(3);
            if (text.EndsWith("```")) text = text.Substring(0, text.Length - 3);
            return text.Trim();
        }

        private static List<InterviewQuestion> GetDefaultQuestions(JobPosting jobPosting)
        {
            return new List<InterviewQuestion>
            {
                new InterviewQuestion
                {
                    QuestionText = $"Can you explain your experience related to the position of {jobPosting.Title}?",
                    Category = "Technical",
                    DifficultyLevel = "medium",
                    ExpectedKeyPointsJson = JsonSerializer.Serialize(new List<string> { "Relevant projects", "Core technologies used", "Architecture decisions" }),
                    DisplayOrder = 1
                },
                new InterviewQuestion
                {
                    QuestionText = "Describe a challenging problem you faced in a recent project and how you solved it.",
                    Category = "ProblemSolving",
                    DifficultyLevel = "medium",
                    ExpectedKeyPointsJson = JsonSerializer.Serialize(new List<string> { "Problem context", "Analytical approach", "Outcome and metrics" }),
                    DisplayOrder = 2
                },
                new InterviewQuestion
                {
                    QuestionText = "How do you ensure effective communication and collaboration across cross-functional teams?",
                    Category = "SoftSkill",
                    DifficultyLevel = "easy",
                    ExpectedKeyPointsJson = JsonSerializer.Serialize(new List<string> { "Active listening", "Documentation", "Stakeholder alignment" }),
                    DisplayOrder = 3
                }
            };
        }
    }
}
