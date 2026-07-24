using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.DTOs.Common
{
    public abstract class BaseDto
    {
        public long Id { get; set; } = 0;
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
