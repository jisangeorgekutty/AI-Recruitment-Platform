using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace AiRecruitmentPlatform.Infrastructure.Services
{
    public class FileService(Cloudinary cloudinary, ILogger<FileService> logger) : IFileService
    {
        public async Task<string?> UploadImageAsync(IFormFile imageFile, string folder)
        {
            try
            {
                await using var stream = imageFile.OpenReadStream();
                var ext = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
                var isRaw = ext is ".pdf" or ".doc" or ".docx" or ".zip";

                if (isRaw)
                {
                    var rawParams = new RawUploadParams
                    {
                        File = new FileDescription(imageFile.FileName, stream),
                        Folder = folder
                    };

                    var rawResult = await cloudinary.UploadAsync(rawParams);

                    if (rawResult.Error != null)
                    {
                        logger.LogError("Cloudinary raw upload failed: {Error}", rawResult.Error.Message);
                        return null;
                    }

                    if (!string.IsNullOrEmpty(rawResult.SecureUrl?.ToString()))
                    {
                        logger.LogInformation("Raw document uploaded successfully: {Url}", rawResult.SecureUrl.ToString());
                        return rawResult.SecureUrl.ToString();
                    }
                }
                else
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(imageFile.FileName, stream),
                        Folder = folder
                    };

                    var uploadResult = await cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.Error != null)
                    {
                        logger.LogError("Cloudinary image upload failed: {Error}", uploadResult.Error.Message);
                        return null;
                    }

                    if (!string.IsNullOrEmpty(uploadResult.SecureUrl?.ToString()))
                    {
                        logger.LogInformation("Image uploaded successfully: {ImageUrl}", uploadResult.SecureUrl.ToString());
                        return uploadResult.SecureUrl.ToString();
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error uploading file to Cloudinary");
                return null;
            }
        }

        public async Task<List<string>> UploadMultipleImagesAsync(List<IFormFile> imageFiles, string folder)
        {
            var uploadedUrls = new List<string>();

            foreach (var imageFile in imageFiles)
            {
                var url = await UploadImageAsync(imageFile, folder);
                if (!string.IsNullOrEmpty(url))
                {
                    uploadedUrls.Add(url);
                }
            }

            return uploadedUrls;
        }

        public async Task<bool> DeleteImageAsync(string publicId)
        {
            try
            {
                var deleteParams = new DeletionParams(publicId);
                var result = await cloudinary.DestroyAsync(deleteParams);

                if (result.Result == "ok")
                {
                    logger.LogInformation("File deleted successfully: {PublicId}", publicId);
                    return true;
                }

                logger.LogWarning("Failed to delete file: {PublicId}", publicId);
                return false;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting file from Cloudinary: {PublicId}", publicId);
                return false;
            }
        }
    }
}
