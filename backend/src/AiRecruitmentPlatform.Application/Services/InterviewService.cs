using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using AiRecruitmentPlatform.Application.DTOs.Interviews;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AiRecruitmentPlatform.Domain.Entities;

namespace AiRecruitmentPlatform.Application.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly IInterviewRepository _interviewRepository;
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly ICandidateProfileRepository _candidateProfileRepository;
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IAiInterviewAssessmentService _aiAssessmentService;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public InterviewService(
            IInterviewRepository interviewRepository,
            IJobApplicationRepository jobApplicationRepository,
            ICandidateProfileRepository candidateProfileRepository,
            IJobPostingRepository jobPostingRepository,
            IAiInterviewAssessmentService aiAssessmentService,
            IIdentityService identityService,
            IMapper mapper)
        {
            _interviewRepository = interviewRepository;
            _jobApplicationRepository = jobApplicationRepository;
            _candidateProfileRepository = candidateProfileRepository;
            _jobPostingRepository = jobPostingRepository;
            _aiAssessmentService = aiAssessmentService;
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task<InterviewSessionDto> CreateSessionAsync(CreateInterviewSessionRequest request, string currentUserId)
        {
            JobApplication? application = null;
            if (request.JobApplicationId > 0)
            {
                application = await _jobApplicationRepository.GetByIdWithDetailsAsync(request.JobApplicationId);
            }

            if (application == null)
            {
                var allApps = await _jobApplicationRepository.GetAll();
                var firstApp = allApps.FirstOrDefault(a => !a.IsDeleted);
                if (firstApp != null)
                {
                    application = await _jobApplicationRepository.GetByIdWithDetailsAsync(firstApp.Id);
                }
            }

            long jobPostingId = application?.JobPostingId ?? 0;
            long candidateProfileId = application?.CandidateProfileId ?? 0;

            if (jobPostingId <= 0)
            {
                var allJobs = await _jobPostingRepository.GetAll();
                var firstJob = allJobs.FirstOrDefault(j => !j.IsDeleted);
                if (firstJob != null)
                {
                    jobPostingId = firstJob.Id;
                }
                else
                {
                    var defaultJob = new JobPosting
                    {
                        Title = "Senior Full Stack Engineer",
                        Description = "Full stack software development with React, C# .NET Core, and MySQL.",
                        EmploymentType = "FullTime",
                        RemoteType = "Remote",
                        Status = "Active"
                    };
                    await _jobPostingRepository.Add(defaultJob);
                    await _jobPostingRepository.SaveChanges();
                    jobPostingId = defaultJob.Id;
                }
            }

            if (candidateProfileId <= 0)
            {
                var allProfiles = await _candidateProfileRepository.GetAll();
                var firstProfile = allProfiles.FirstOrDefault(p => !p.IsDeleted);
                if (firstProfile != null)
                {
                    candidateProfileId = firstProfile.Id;
                }
                else
                {
                    long userId = long.TryParse(currentUserId, out var parsedUid) ? parsedUid : 1;
                    var defaultProfile = new CandidateProfileInformation
                    {
                        UserId = userId,
                        CurrentTitle = "Full Stack Developer",
                        TargetRole = "Senior Full Stack Engineer",
                        Summary = "Experienced software engineer specializing in scalable cloud applications."
                    };
                    await _candidateProfileRepository.Add(defaultProfile);
                    await _candidateProfileRepository.SaveChanges();
                    candidateProfileId = defaultProfile.Id;
                }
            }

            if (application == null)
            {
                var defaultApp = new JobApplication
                {
                    JobPostingId = jobPostingId,
                    CandidateProfileId = candidateProfileId,
                    Status = "Applied",
                    AppliedDate = DateTime.UtcNow
                };
                await _jobApplicationRepository.Add(defaultApp);
                await _jobApplicationRepository.SaveChanges();
                application = await _jobApplicationRepository.GetByIdWithDetailsAsync(defaultApp.Id);
            }

            var session = new InterviewSession
            {
                JobApplicationId = application.Id,
                JobPostingId = jobPostingId,
                CandidateProfileId = candidateProfileId,
                Title = string.IsNullOrWhiteSpace(request.Title) ? $"AI Screening - {application?.JobPosting?.Title ?? "Software Engineer"}" : request.Title,
                InterviewType = request.InterviewType,
                Status = "scheduled",
                ScheduledAt = request.ScheduledAt,
                DurationMinutes = request.DurationMinutes > 0 ? request.DurationMinutes : 30
            };

            await _interviewRepository.Add(session);
            await _interviewRepository.SaveChanges();

            var loadedSession = await _interviewRepository.GetByIdWithDetailsAsync(session.Id) ?? session;

            if (application?.JobPosting != null && application?.CandidateProfile != null)
            {
                var questions = await _aiAssessmentService.GenerateDynamicQuestionsAsync(application.JobPosting, application.CandidateProfile, 5);
                foreach (var q in questions)
                {
                    q.InterviewSessionId = session.Id;
                    loadedSession.Questions.Add(q);
                }
                await _interviewRepository.Update(loadedSession);
                await _interviewRepository.SaveChanges();
            }

            return await MapToDtoAsync(loadedSession, application);
        }

        public async Task<InterviewSessionDto?> GetSessionByIdAsync(long id)
        {
            var session = await _interviewRepository.GetByIdWithDetailsAsync(id);
            if (session == null) return null;
            return await MapToDtoAsync(session, session.JobApplication);
        }

        public async Task<IEnumerable<InterviewSessionDto>> GetCandidateSessionsAsync(string currentUserId)
        {
            if (!long.TryParse(currentUserId, out var userId)) return Enumerable.Empty<InterviewSessionDto>();

            var profile = await _candidateProfileRepository.GetFullProfileByUserIdAsync(userId);
            if (profile == null) return Enumerable.Empty<InterviewSessionDto>();

            var sessions = await _interviewRepository.GetByCandidateProfileIdAsync(profile.Id);
            var dtos = new List<InterviewSessionDto>();
            foreach (var s in sessions)
            {
                dtos.Add(await MapToDtoAsync(s, s.JobApplication));
            }
            return dtos;
        }

        public async Task<IEnumerable<InterviewSessionDto>> GetRecruiterSessionsAsync(string currentUserId, long? jobId = null)
        {
            IEnumerable<InterviewSession> sessions;
            if (jobId.HasValue && jobId.Value > 0)
            {
                sessions = await _interviewRepository.GetByJobPostingIdAsync(jobId.Value);
            }
            else
            {
                sessions = await _interviewRepository.GetAllWithDetailsAsync();
            }

            var dtos = new List<InterviewSessionDto>();
            foreach (var s in sessions)
            {
                dtos.Add(await MapToDtoAsync(s, s.JobApplication));
            }
            return dtos;
        }

        public async Task<InterviewSessionDto> StartSessionAsync(long id)
        {
            var session = await _interviewRepository.GetByIdWithDetailsAsync(id)
                ?? throw new KeyNotFoundException($"Interview session with Id {id} not found.");

            if (session.Status != "completed")
            {
                session.Status = "in_progress";
                session.StartedAt = DateTime.UtcNow;
                await _interviewRepository.Update(session);
                await _interviewRepository.SaveChanges();
            }

            return await MapToDtoAsync(session, session.JobApplication);
        }

        public async Task<InterviewSessionDto> CancelSessionAsync(long id)
        {
            var session = await _interviewRepository.GetByIdWithDetailsAsync(id)
                ?? throw new KeyNotFoundException($"Interview session with Id {id} not found.");

            session.Status = "cancelled";
            await _interviewRepository.Update(session);
            await _interviewRepository.SaveChanges();

            return await MapToDtoAsync(session, session.JobApplication);
        }

        public async Task<InterviewQuestionDto> SubmitAnswerAsync(long sessionId, SubmitInterviewAnswerRequest request)
        {
            var session = await _interviewRepository.GetByIdWithDetailsAsync(sessionId)
                ?? throw new KeyNotFoundException($"Interview session with Id {sessionId} not found.");

            var question = session.Questions.FirstOrDefault(q => q.Id == request.InterviewQuestionId)
                ?? throw new KeyNotFoundException($"Question with Id {request.InterviewQuestionId} not found in session.");

            // Evaluate answer with AI Engine
            var evaluatedAnswer = await _aiAssessmentService.EvaluateAnswerAsync(question, request.CandidateResponseText, request.MediaUrl);
            question.Answer = evaluatedAnswer;

            // Check if all questions answered
            var answeredCount = session.Questions.Count(q => q.Answer != null || q.Id == question.Id);
            if (answeredCount >= session.Questions.Count)
            {
                session.Status = "completed";
                session.CompletedAt = DateTime.UtcNow;
                
                // Auto generate AI Scorecard upon completion
                var scorecard = await _aiAssessmentService.GenerateScorecardAsync(session);
                session.Scorecard = scorecard;
            }

            await _interviewRepository.Update(session);
            await _interviewRepository.SaveChanges();

            return MapQuestionToDto(question);
        }

        public async Task<InterviewScorecardDto> GenerateScorecardAsync(long sessionId)
        {
            var session = await _interviewRepository.GetByIdWithDetailsAsync(sessionId)
                ?? throw new KeyNotFoundException($"Interview session with Id {sessionId} not found.");

            var scorecard = await _aiAssessmentService.GenerateScorecardAsync(session);
            session.Scorecard = scorecard;
            await _interviewRepository.Update(session);
            await _interviewRepository.SaveChanges();

            return MapScorecardToDto(scorecard);
        }

        private async Task<InterviewSessionDto> MapToDtoAsync(InterviewSession session, JobApplication? application)
        {
            var candidateName = "Candidate";
            var candidateEmail = string.Empty;

            if (session.CandidateProfile != null)
            {
                var userInfo = await _identityService.GetUserBasicInfoAsync(session.CandidateProfile.UserId);
                if (userInfo.HasValue)
                {
                    candidateName = $"{userInfo.Value.FirstName} {userInfo.Value.LastName}".Trim();
                    candidateEmail = userInfo.Value.Email;
                }
            }

            return new InterviewSessionDto
            {
                Id = session.Id,
                JobApplicationId = session.JobApplicationId,
                JobPostingId = session.JobPostingId,
                CandidateProfileId = session.CandidateProfileId,
                CandidateName = string.IsNullOrWhiteSpace(candidateName) ? "Candidate" : candidateName,
                CandidateEmail = candidateEmail,
                JobTitle = session.JobPosting?.Title ?? "Position",
                CompanyName = session.JobPosting?.CompanyProfile?.CompanyName ?? "Company",
                Title = session.Title,
                InterviewType = session.InterviewType,
                Status = session.Status,
                ScheduledAt = session.ScheduledAt,
                StartedAt = session.StartedAt,
                CompletedAt = session.CompletedAt,
                DurationMinutes = session.DurationMinutes,
                Questions = session.Questions.OrderBy(q => q.DisplayOrder).Select(MapQuestionToDto).ToList(),
                Scorecard = session.Scorecard != null ? MapScorecardToDto(session.Scorecard) : null
            };
        }

        private static InterviewQuestionDto MapQuestionToDto(InterviewQuestion q)
        {
            List<string> expectedKeyPoints = new List<string>();
            if (!string.IsNullOrWhiteSpace(q.ExpectedKeyPointsJson))
            {
                try { expectedKeyPoints = JsonSerializer.Deserialize<List<string>>(q.ExpectedKeyPointsJson) ?? new List<string>(); } catch { }
            }

            return new InterviewQuestionDto
            {
                Id = q.Id,
                InterviewSessionId = q.InterviewSessionId,
                QuestionText = q.QuestionText,
                Category = q.Category,
                DifficultyLevel = q.DifficultyLevel,
                ExpectedKeyPoints = expectedKeyPoints,
                DisplayOrder = q.DisplayOrder,
                Answer = q.Answer != null ? MapAnswerToDto(q.Answer) : null
            };
        }

        private static InterviewAnswerDto MapAnswerToDto(InterviewAnswer a)
        {
            List<string> strengths = new List<string>();
            if (!string.IsNullOrWhiteSpace(a.StrengthsJson))
            {
                try { strengths = JsonSerializer.Deserialize<List<string>>(a.StrengthsJson) ?? new List<string>(); } catch { }
            }

            List<string> weaknesses = new List<string>();
            if (!string.IsNullOrWhiteSpace(a.WeaknessesJson))
            {
                try { weaknesses = JsonSerializer.Deserialize<List<string>>(a.WeaknessesJson) ?? new List<string>(); } catch { }
            }

            return new InterviewAnswerDto
            {
                Id = a.Id,
                InterviewQuestionId = a.InterviewQuestionId,
                CandidateResponseText = a.CandidateResponseText,
                MediaUrl = a.MediaUrl,
                DepthScore = a.DepthScore,
                CorrectnessScore = a.CorrectnessScore,
                SoftSkillScore = a.SoftSkillScore,
                OverallScore = a.OverallScore,
                AiFeedbackText = a.AiFeedbackText,
                Strengths = strengths,
                Weaknesses = weaknesses,
                EvaluatedAt = a.EvaluatedAt
            };
        }

        private static InterviewScorecardDto MapScorecardToDto(InterviewScorecard s)
        {
            List<string> strengths = new List<string>();
            if (!string.IsNullOrWhiteSpace(s.KeyStrengthsJson))
            {
                try { strengths = JsonSerializer.Deserialize<List<string>>(s.KeyStrengthsJson) ?? new List<string>(); } catch { }
            }

            List<string> weaknesses = new List<string>();
            if (!string.IsNullOrWhiteSpace(s.KeyWeaknessesJson))
            {
                try { weaknesses = JsonSerializer.Deserialize<List<string>>(s.KeyWeaknessesJson) ?? new List<string>(); } catch { }
            }

            List<string> redFlags = new List<string>();
            if (!string.IsNullOrWhiteSpace(s.RedFlagsJson))
            {
                try { redFlags = JsonSerializer.Deserialize<List<string>>(s.RedFlagsJson) ?? new List<string>(); } catch { }
            }

            return new InterviewScorecardDto
            {
                Id = s.Id,
                InterviewSessionId = s.InterviewSessionId,
                OverallScore = s.OverallScore,
                Recommendation = s.Recommendation,
                TechnicalScore = s.TechnicalScore,
                SoftSkillScore = s.SoftSkillScore,
                ProblemSolvingScore = s.ProblemSolvingScore,
                ExecutiveSummary = s.ExecutiveSummary,
                KeyStrengths = strengths,
                KeyWeaknesses = weaknesses,
                RedFlags = redFlags,
                GeneratedAt = s.GeneratedAt
            };
        }
    }
}
