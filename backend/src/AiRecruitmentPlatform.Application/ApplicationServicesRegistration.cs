using AiRecruitmentPlatform.Application.Profiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application
{
    public static class ApplicationServicesRegistration
    {
        public static IServiceCollection ConfigureApplicationServices(this IServiceCollection services,
    IConfiguration configuration)
        {
            services.AddAutoMapper(typeof(MappingProfile));


            return services;
        }
    }
}
