using System;

namespace AiRecruitmentPlatform.Application.DTOs.Admin
{
    public class AdminPaymentDto
    {
        public string Id { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Amount { get; set; } = string.Empty;
        public decimal NumericAmount { get; set; }
        public string Plan { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Method { get; set; } = string.Empty;
    }
}
