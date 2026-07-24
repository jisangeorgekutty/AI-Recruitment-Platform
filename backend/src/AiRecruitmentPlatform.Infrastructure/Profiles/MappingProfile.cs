using AiRecruitmentPlatform.Application.DTOs.Authentication;
using AiRecruitmentPlatform.Infrastructure.Identity.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Infrastructure.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ApplicationUser, AuthenticationResponse>().ReverseMap();
        }
    }
}
