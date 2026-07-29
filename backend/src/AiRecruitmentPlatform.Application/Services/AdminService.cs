using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Admin;
using AiRecruitmentPlatform.Application.Interfaces.Repositories;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using AutoMapper;

namespace AiRecruitmentPlatform.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IIdentityService _identityService;
        private readonly ICompanyProfileRepository _companyProfileRepository;
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly ISubscriptionPlanRepository _subscriptionPlanRepository;
        private readonly IPaymentTransactionRepository _paymentTransactionRepository;
        private readonly IAuditLogService _auditLogService;
        private readonly IMapper _mapper;

        public AdminService(
            IIdentityService identityService,
            ICompanyProfileRepository companyProfileRepository,
            IJobPostingRepository jobPostingRepository,
            IJobApplicationRepository jobApplicationRepository,
            ISubscriptionPlanRepository subscriptionPlanRepository,
            IPaymentTransactionRepository paymentTransactionRepository,
            IAuditLogService auditLogService,
            IMapper mapper)
        {
            _identityService = identityService;
            _companyProfileRepository = companyProfileRepository;
            _jobPostingRepository = jobPostingRepository;
            _jobApplicationRepository = jobApplicationRepository;
            _subscriptionPlanRepository = subscriptionPlanRepository;
            _paymentTransactionRepository = paymentTransactionRepository;
            _auditLogService = auditLogService;
            _mapper = mapper;
        }

        public async Task<AdminDashboardStatsDto> GetAdminDashboardStatsAsync()
        {
            var candidateIds = await _identityService.GetUserIdsInRoleAsync("candidate");
            var recruiterIds = await _identityService.GetUserIdsInRoleAsync("recruiter");
            var adminIds = await _identityService.GetUserIdsInRoleAsync("admin");

            var companies = await _companyProfileRepository.GetAllActive();
            var jobs = await _jobPostingRepository.GetAllActive();
            var applications = await _jobApplicationRepository.GetAllActive();
            var transactions = await _paymentTransactionRepository.GetAllActive();

            int totalUsers = candidateIds.Count + recruiterIds.Count + adminIds.Count;
            var now = DateTime.UtcNow;
            decimal monthlyRevenue = transactions
                .Where(t => t.Status == "succeeded" && t.CreatedOn.Month == now.Month && t.CreatedOn.Year == now.Year)
                .Sum(t => t.Amount);

            var recentUsersFromDb = await _identityService.GetRecentUsersAsync(5);
            var recentUserDtos = recentUsersFromDb.Select(u => new RecentUserDto
            {
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                Plan = u.Role.Equals("recruiter", StringComparison.OrdinalIgnoreCase) ? "Professional" : "Free",
                Date = u.CreatedOn.ToString("g"),
                CreatedOn = u.CreatedOn
            }).ToList();

            return new AdminDashboardStatsDto
            {
                TotalUsers = totalUsers,
                ActiveCandidates = candidateIds.Count,
                ActiveRecruiters = recruiterIds.Count,
                TotalCompanies = companies.Count,
                PendingCompanyVerifications = companies.Count(c => c.IsVerified == false),
                TotalActiveJobs = jobs.Count(j => j.Status.Equals("active", StringComparison.OrdinalIgnoreCase)),
                TotalApplications = applications.Count,
                TotalMonthlyRevenue = monthlyRevenue,
                RecentUsers = recentUserDtos
            };
        }

        public async Task<IReadOnlyList<AdminUserListDto>> GetUsersAsync(string? search, string? role, string? status)
        {
            var usersFromDb = await _identityService.GetAllUsersInfoAsync(search, role, status);
            return usersFromDb.Select(u => new AdminUserListDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                Plan = u.Role.Equals("recruiter", StringComparison.OrdinalIgnoreCase) ? "Professional" : "Free",
                Status = u.Status,
                JobsCount = 0,
                Joined = u.Joined,
                CreatedOn = u.CreatedOn
            }).ToList();
        }

        public async Task<bool> UpdateUserStatusAsync(long userId, string status)
        {
            await _auditLogService.LogAsync(userId, $"user_{userId}@platform.local", "User Status Updated", $"Status changed to {status}", "medium");
            return true;
        }

        public async Task<bool> UpdateUserRoleAsync(long userId, string newRole)
        {
            await _identityService.AddToRoleAsync(userId, newRole);
            await _auditLogService.LogAsync(userId, $"user_{userId}@platform.local", "User Role Updated", $"Role changed to {newRole}", "high");
            return true;
        }

        public async Task<IReadOnlyList<AdminCompanyListDto>> GetCompaniesAsync(string? search, string? status)
        {
            var dbCompanies = await _companyProfileRepository.GetAllActive();
            var result = new List<AdminCompanyListDto>();

            foreach (var c in dbCompanies)
            {
                result.Add(new AdminCompanyListDto
                {
                    Id = c.Id,
                    Name = c.CompanyName ?? "Unnamed Company",
                    Email = c.ContactEmail ?? "admin@company.com",
                    Industry = c.Industry ?? "Technology",
                    Plan = "Professional",
                    Status = c.IsVerified ? "verified" : "pending",
                    Employees = c.CompanySize ?? "10-50",
                    ActiveJobsCount = 0,
                    CreatedOn = c.CreatedOn
                });
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                result = result.Where(c => c.Name.ToLower().Contains(term) || c.Email.ToLower().Contains(term)).ToList();
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                result = result.Where(c => c.Status.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            return result;
        }

        public async Task<bool> UpdateCompanyStatusAsync(long companyId, string status)
        {
            var company = await _companyProfileRepository.Get(companyId);
            if (company != null)
            {
                company.IsVerified = (status == "verified");
                await _companyProfileRepository.Update(company);
                await _companyProfileRepository.SaveChanges();
            }

            await _auditLogService.LogAsync(null, "admin@system.local", "Company Status Updated", $"Company {companyId} marked as {status}", "medium");
            return true;
        }

        public async Task<IReadOnlyList<AdminPaymentDto>> GetAdminPaymentsAsync(string? search)
        {
            var dbTransactions = await _paymentTransactionRepository.GetAllActive();
            var companies = await _companyProfileRepository.GetAllActive();
            var plans = await _subscriptionPlanRepository.GetAllActive();

            var list = new List<AdminPaymentDto>();
            foreach (var t in dbTransactions)
            {
                var company = companies.FirstOrDefault(c => c.Id == t.CompanyProfileId);
                var plan = plans.FirstOrDefault(p => p.Id == t.SubscriptionPlanId);

                list.Add(new AdminPaymentDto
                {
                    Id = string.IsNullOrEmpty(t.StripeSessionId) ? $"TXN-{t.Id:D5}" : t.StripeSessionId,
                    Company = company?.CompanyName ?? $"Company #{t.CompanyProfileId}",
                    Amount = $"${t.Amount:F2}",
                    NumericAmount = t.Amount,
                    Plan = plan?.Name ?? "Subscription",
                    Status = t.Status == "succeeded" ? "paid" : t.Status,
                    Date = t.CreatedOn,
                    Method = "Stripe"
                });
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                list = list.Where(p => p.Id.ToLower().Contains(term) || p.Company.ToLower().Contains(term) || p.Plan.ToLower().Contains(term) || p.Status.ToLower().Contains(term)).ToList();
            }

            return list.OrderByDescending(p => p.Date).ToList();
        }
    }
}
