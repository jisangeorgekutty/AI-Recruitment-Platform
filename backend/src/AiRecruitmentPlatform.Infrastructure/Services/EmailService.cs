using AiRecruitmentPlatform.Application.DTOs.Framework;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public Task Send(MessageDto message)
        {
            var emailMessage = CreateEmailMessage(message);
            Send(emailMessage, message.From!);
            return Task.CompletedTask;
        }

        public Task Authenticate(EmailDto email)
        {
            using var client = new SmtpClient();
            try
            {
                switch (email.Port)
                {
                    case 465:
                        client.Connect(email.SmtpServer, email.Port, true);
                        break;

                    case 25:
                    case 587:
                        client.Connect(email.SmtpServer, email.Port, SecureSocketOptions.StartTls);
                        break;

                    default:
                        client.Connect(email.SmtpServer, email.Port, false);
                        break;
                }

                // ReSharper disable once StringLiteralTypo
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(email.EmailId, email.Password);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }

            return Task.CompletedTask;
        }

        private static MimeMessage CreateEmailMessage(MessageDto message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(message.From!.Name, message.From!.EmailId));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;


            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = message.Content
            };

            foreach (var attachmentPath in message.AttachmentPaths.Where(x => !string.IsNullOrEmpty(x)))
                bodyBuilder.Attachments.Add("wwwroot/" + attachmentPath);


            emailMessage.Body = bodyBuilder.ToMessageBody();
            return emailMessage;
        }

        private static void Send(MimeMessage mailMessage, EmailDto sender)
        {
            using var client = new SmtpClient();
            try
            {
                switch (sender.Port)
                {
                    case 465:
                        client.Connect(sender.SmtpServer, sender.Port, true);
                        break;

                    case 25:
                    case 587:
                        client.Connect(sender.SmtpServer, sender.Port, SecureSocketOptions.StartTls);
                        break;

                    default:
                        client.Connect(sender.SmtpServer, sender.Port, false);
                        break;
                }

                // ReSharper disable once StringLiteralTypo
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(sender.EmailId, sender.Password);
                client.Send(mailMessage);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }
        }
    }
}
