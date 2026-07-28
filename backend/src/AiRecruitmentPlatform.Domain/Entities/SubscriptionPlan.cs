using System;
using AiRecruitmentPlatform.Domain.Entities.Common;

namespace AiRecruitmentPlatform.Domain.Entities
{
    public class SubscriptionPlan : OrderableBaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; } = 0;
        public string BillingCycle { get; set; } = "monthly"; // monthly, annual
        public int MaxUsers { get; set; } = 1;
        public int MaxJobs { get; set; } = 3;
        public string FeaturesJson { get; set; } = "[]";
        public int SubscribersCount { get; set; } = 0;
        public string BadgeColor { get; set; } = "text-gray-600 bg-gray-100";
    }
}
