using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class CandidateComparisonRequest
    {
        public List<long> ApplicationIds { get; set; } = new List<long>();
    }
}
