using AiRecruitmentPlatform.Application;
using AiRecruitmentPlatform.Infrastructure;
using CloudinaryDotNet;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.ConfigureApplicationServices(builder.Configuration);
builder.Services.ConfigureInfrastructureServices(builder.Configuration);

// Cloudinary config from appsettings
var cloudName = builder.Configuration["Cloudinary:CloudName"];
var apiKey = builder.Configuration["Cloudinary:ApiKey"];
var apiSecret = builder.Configuration["Cloudinary:ApiSecret"];

if (!string.IsNullOrWhiteSpace(cloudName) && !string.IsNullOrWhiteSpace(apiKey) && !string.IsNullOrWhiteSpace(apiSecret))
{
    var account = new Account(cloudName, apiKey, apiSecret);
    var cloudinary = new Cloudinary(account);
    builder.Services.AddSingleton(cloudinary);
}

// Configure CORS
var frontendUrl = builder.Configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(frontendUrl, "http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

// Configure Swagger with JWT Bearer authentication
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AI Recruitment Platform API",
        Version = "v1",
        Description = "API documentation for AI Recruitment Platform with JWT Authentication"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AI Recruitment Platform API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseStaticFiles();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<AiRecruitmentPlatform.Infrastructure.Hubs.NotificationHub>("/hubs/notifications");

app.Run();
