using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.DTOs.Framework
{
    public class MessageDto
    {
        public List<MailboxAddress>? To { get; set; }
        public EmailDto? From { get; set; }
        public string? Subject { get; set; }
        public string? Content { get; set; }
        public List<string?> AttachmentPaths { get; set; } = new();
    }
}
