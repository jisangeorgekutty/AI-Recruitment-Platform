using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace AiRecruitmentPlatform.Infrastructure.Persistence
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            var apiPath = Path.Combine(Directory.GetCurrentDirectory(), "src", "AiRecruitmentPlatform.Api");
            if (!Directory.Exists(apiPath))
            {
                apiPath = Path.Combine(Directory.GetCurrentDirectory(), "../AiRecruitmentPlatform.Api");
            }
            if (!Directory.Exists(apiPath))
            {
                apiPath = Directory.GetCurrentDirectory();
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(apiPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("ConnectionString");

            optionsBuilder.UseSnakeCaseNamingConvention();

            optionsBuilder.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString),
                b =>
                {
                    b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                }
            );

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
