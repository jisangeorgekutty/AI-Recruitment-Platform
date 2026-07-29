using System;

namespace AiRecruitmentPlatform.Application.DTOs.Payment
{
    public class SubscriptionStatusDto
    {
        public long CompanyProfileId { get; set; }
        public long PlanId { get; set; }
        public string PlanName { get; set; } = "Free / Starter";
        public decimal Price { get; set; } = 0;
        public string BillingCycle { get; set; } = "monthly";
        public string Status { get; set; } = "active";
        public DateTime? CurrentPeriodStart { get; set; }
        public DateTime? CurrentPeriodEnd { get; set; }
        public int MaxJobs { get; set; } = 3;
        public int MaxUsers { get; set; } = 1;
        public bool CancelAtPeriodEnd { get; set; } = false;
        public string? StripeSubscriptionId { get; set; }
    }
}
