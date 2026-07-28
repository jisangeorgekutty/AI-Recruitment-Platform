using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Candidate
{
    public class BatchStageUpdateRequest
    {
        public List<BatchStageUpdateDto> Updates { get; set; } = new List<BatchStageUpdateDto>();
    }
}
