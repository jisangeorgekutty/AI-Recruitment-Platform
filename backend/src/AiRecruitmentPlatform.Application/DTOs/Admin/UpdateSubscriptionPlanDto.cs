using System.Collections.Generic;

namespace AiRecruitmentPlatform.Application.DTOs.Admin
{
    public class UpdateSubscriptionPlanDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string BillingCycle { get; set; } = "monthly";
        public int MaxUsers { get; set; }
        public int MaxJobs { get; set; }
        public List<string> Features { get; set; } = new();
        public string BadgeColor { get; set; } = "text-gray-600 bg-gray-100";
        public long DisplayOrder { get; set; }
    }
}
