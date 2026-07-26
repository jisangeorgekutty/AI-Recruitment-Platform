using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Domain.Entities;
using AiRecruitmentPlatform.Domain.Entities.Common;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Add your mapping configurations here
            CreateMap<BaseEntity, BaseDto>()
    .IncludeAllDerived()
    .ReverseMap()
    .ForPath(x => x.Id, x => x.Ignore())
    .ForPath(x => x.CreatedOn, x => x.Ignore())
    .ForPath(x => x.ModifiedOn, x => x.Ignore())
    .ForPath(x => x.ModifiedOn, x => x.Ignore())
    .ForPath(x => x.ModifiedBy, x => x.Ignore())
    .ForPath(x => x.IsDeleted, x => x.Ignore());

            CreateMap<OrderableBaseEntity, OrderableDto>().IncludeBase<BaseEntity, BaseDto>().ReverseMap();

            CreateMap<int?, int>().ConvertUsing((src, dest) => src ?? dest);

            // Candidate Profile Mappings
            CreateMap<CandidateProfileInformation, CandidateProfileDto>()
                .ForMember(dest => dest.ProfileInformationId, opt => opt.MapFrom(src => src.Id));

            CreateMap<CandidateSocialLink, CandidateSocialLinksDto>().ReverseMap();
            CreateMap<UpdateCandidateSocialLinksRequest, CandidateSocialLink>();
            CreateMap<UpdateCandidatePersonalInfoRequest, CandidateProfileInformation>();
            CreateMap<CandidateExperience, CandidateExperienceDto>().ReverseMap();
            CreateMap<CandidateEducation, CandidateEducationDto>().ReverseMap();
            CreateMap<CandidateSkill, CandidateSkillDto>().ReverseMap();
            CreateMap<CandidateLanguage, CandidateLanguageDto>().ReverseMap();

            // Settings Mappings
            CreateMap<RecruiterNotificationPreference, DTOs.Settings.RecruiterNotificationPreferenceDto>().ReverseMap();
            CreateMap<DTOs.Settings.UpdateRecruiterNotificationPreferenceRequest, RecruiterNotificationPreference>();

            // Company Profile Mappings
            CreateMap<CompanyProfile, DTOs.Company.CompanyProfileDto>().ReverseMap();
            CreateMap<DTOs.Company.UpdateCompanyProfileRequest, CompanyProfile>();

            // Job Posting Mappings
            CreateMap<JobPosting, DTOs.Job.JobPostingDto>()
                .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.CompanyProfile != null ? src.CompanyProfile.CompanyName : string.Empty))
                .ForMember(dest => dest.CompanyLogoUrl, opt => opt.MapFrom(src => src.CompanyProfile != null ? src.CompanyProfile.CompanyLogoUrl : null));
            CreateMap<DTOs.Job.CreateJobPostingDto, JobPosting>();
            CreateMap<DTOs.Job.UpdateJobPostingDto, JobPosting>();
            CreateMap<JobSkill, DTOs.Job.JobSkillDto>().ReverseMap();
            CreateMap<JobScreeningQuestion, DTOs.Job.JobScreeningQuestionDto>().ReverseMap();

            // Phase 3 Mappings
            CreateMap<JobApplication, DTOs.Job.JobApplicationDto>()
                .ForMember(dest => dest.JobTitle, opt => opt.MapFrom(src => src.JobPosting != null ? src.JobPosting.Title : string.Empty))
                .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.JobPosting != null && src.JobPosting.CompanyProfile != null ? src.JobPosting.CompanyProfile.CompanyName : string.Empty))
                .ForMember(dest => dest.CompanyLogoUrl, opt => opt.MapFrom(src => src.JobPosting != null && src.JobPosting.CompanyProfile != null ? src.JobPosting.CompanyProfile.CompanyLogoUrl : null))
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.JobPosting != null ? src.JobPosting.Location : string.Empty))
                .ForMember(dest => dest.ResumeUrl, opt => opt.MapFrom(src => src.CustomResumeUrl ?? (src.CandidateResume != null ? src.CandidateResume.FileUrl : null)));

            CreateMap<JobApplicationAnswer, DTOs.Job.JobApplicationAnswerDto>()
                .ForMember(dest => dest.QuestionText, opt => opt.MapFrom(src => src.JobScreeningQuestion != null ? src.JobScreeningQuestion.QuestionText : null));

            CreateMap<CandidateResume, CandidateResumeDto>().ReverseMap();
            CreateMap<CandidateSavedJob, DTOs.Job.CandidateSavedJobDto>().ReverseMap();
            CreateMap<CandidateResumeAnalysis, CandidateResumeDto>().ReverseMap();
        }
    }
}


