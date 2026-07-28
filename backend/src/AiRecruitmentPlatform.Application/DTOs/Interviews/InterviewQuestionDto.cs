using System;
using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Interviews
{
    public class InterviewQuestionDto
    {
        public long Id { get; set; }
        public long InterviewSessionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string Category { get; set; } = "Technical";
        public string DifficultyLevel { get; set; } = "medium";
        public List<string> ExpectedKeyPoints { get; set; } = new List<string>();
        public long DisplayOrder { get; set; }
        public InterviewAnswerDto? Answer { get; set; }
    }
}
