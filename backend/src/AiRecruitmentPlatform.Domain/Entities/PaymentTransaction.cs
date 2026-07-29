using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class PaymentTransaction : BaseEntity
    {
        public long CompanyProfileId { get; set; }
        public long? SubscriptionPlanId { get; set; }
        public string StripeSessionId { get; set; } = string.Empty;
        public string? StripePaymentIntentId { get; set; }
        public decimal Amount { get; set; } = 0;
        public string Currency { get; set; } = "usd";
        public string Status { get; set; } = "pending"; // pending, succeeded, failed
        public string? FailureReason { get; set; }

        // Navigation properties
        public CompanyProfile? CompanyProfile { get; set; }
        public SubscriptionPlan? SubscriptionPlan { get; set; }
    }
}
