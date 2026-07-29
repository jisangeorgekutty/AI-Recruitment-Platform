using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class CompanySubscription : BaseEntity
    {
        public long CompanyProfileId { get; set; }
        public long SubscriptionPlanId { get; set; }
        public string? StripeCustomerId { get; set; }
        public string? StripeSubscriptionId { get; set; }
        public string? StripeSessionId { get; set; }
        public string Status { get; set; } = "active";
        public DateTime? CurrentPeriodStart { get; set; }
        public DateTime? CurrentPeriodEnd { get; set; }
        public bool CancelAtPeriodEnd { get; set; } = false;

        // Navigation properties
        public CompanyProfile? CompanyProfile { get; set; }
        public SubscriptionPlan? SubscriptionPlan { get; set; }
    }
}
