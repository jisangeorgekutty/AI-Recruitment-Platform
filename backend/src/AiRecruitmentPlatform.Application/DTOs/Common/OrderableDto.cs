using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.DTOs.Common
{
    public abstract class OrderableDto : BaseDto
    {
        public long DisplayOrder { get; set; }
    }
}
