using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AiRecruitmentPlatform.Application.Interfaces.Services
{
    public interface IFileService
    {
        Task<string?> UploadImageAsync(IFormFile imageFile, string folder);
        Task<List<string>> UploadMultipleImagesAsync(List<IFormFile> imageFiles, string folder);
        Task<bool> DeleteImageAsync(string publicId);
    }
}
