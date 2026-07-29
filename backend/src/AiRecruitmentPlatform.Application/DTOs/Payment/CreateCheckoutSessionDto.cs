namespace AiRecruitmentPlatform.Application.DTOs.Payment
{
    public class CreateCheckoutSessionDto
    {
        public long PlanId { get; set; }
        public string? SuccessUrl { get; set; }
        public string? CancelUrl { get; set; }
    }
}
