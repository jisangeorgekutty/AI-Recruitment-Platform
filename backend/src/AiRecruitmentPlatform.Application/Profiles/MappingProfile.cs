using AiRecruitmentPlatform.Application.DTOs.Common;
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

        }
    }
}
