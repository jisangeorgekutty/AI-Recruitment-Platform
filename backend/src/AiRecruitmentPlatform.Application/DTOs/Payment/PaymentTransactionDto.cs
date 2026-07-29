using System;

namespace AiRecruitmentPlatform.Application.DTOs.Payment
{
    public class PaymentTransactionDto
    {
        public long Id { get; set; }
        public long CompanyProfileId { get; set; }
        public long? SubscriptionPlanId { get; set; }
        public string? PlanName { get; set; }
        public string StripeSessionId { get; set; } = string.Empty;
        public string? StripePaymentIntentId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "usd";
        public string Status { get; set; } = "pending";
        public string? FailureReason { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
