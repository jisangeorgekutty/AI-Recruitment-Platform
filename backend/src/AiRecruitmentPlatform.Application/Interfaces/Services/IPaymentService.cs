using System.Collections.Generic;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Payment;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IPaymentService
    {
        Task<CheckoutSessionResponseDto> CreateCheckoutSessionAsync(long userId, CreateCheckoutSessionDto dto);
        Task<SubscriptionStatusDto> VerifySessionAndActivateSubscriptionAsync(long userId, string sessionId);
        Task<SubscriptionStatusDto> GetCurrentSubscriptionAsync(long userId);
        Task<IEnumerable<PaymentTransactionDto>> GetCompanyTransactionsAsync(long userId);
        Task ProcessStripeWebhookAsync(string json, string stripeSignature);
    }
}
