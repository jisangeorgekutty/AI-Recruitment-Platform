using AiRecruitmentPlatform.Application.DTOs.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IEmailService
    {
        public Task Send(MessageDto message);

        public Task Authenticate(EmailDto email);
    }
}
