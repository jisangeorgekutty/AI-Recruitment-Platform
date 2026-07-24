using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Domain.Entities.Common
{
    public abstract class OrderableBaseEntity : BaseEntity
    {
        public long DisplayOrder { get; set; }
    }
}
