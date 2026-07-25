using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AiRecruitmentPlatform.Application.DTOs.Candidate;
using AiRecruitmentPlatform.Application.DTOs.Common;
using AiRecruitmentPlatform.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AiRecruitmentPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/candidate/profile")]
    public class CandidateProfileController : ControllerBase
    {
        private readonly ICandidateProfileService _profileService;

        public CandidateProfileController(ICandidateProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateProfileDto>>> GetMyProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _profileService.GetProfileByUserIdAsync(userId);
                return Ok(ApiResponse<CandidateProfileDto>.SuccessResult(profile, "Candidate profile retrieved."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateProfileDto>.FailureResult(ex.Message));
            }
        }

        [HttpGet("{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateProfileDto>>> GetProfileById(long id)
        {
            try
            {
                var profile = await _profileService.GetProfileByIdAsync(id);
                return Ok(ApiResponse<CandidateProfileDto>.SuccessResult(profile, "Candidate profile retrieved."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateProfileDto>.FailureResult(ex.Message));
            }
        }

        [HttpPut("personal")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateProfileDto>>> UpdatePersonalInfo([FromBody] UpdateCandidatePersonalInfoRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updated = await _profileService.UpdatePersonalInfoAsync(userId, request);
                return Ok(ApiResponse<CandidateProfileDto>.SuccessResult(updated, "Personal information updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateProfileDto>.FailureResult(ex.Message));
            }
        }

        [HttpPut("social-links")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateProfileDto>>> UpdateSocialLinks([FromBody] UpdateCandidateSocialLinksRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updated = await _profileService.UpdateSocialLinksAsync(userId, request);
                return Ok(ApiResponse<CandidateProfileDto>.SuccessResult(updated, "Social links updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateProfileDto>.FailureResult(ex.Message));
            }
        }

        [HttpPost("experiences")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateExperienceDto>>> AddExperience([FromBody] CandidateExperienceDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.AddExperienceAsync(userId, dto);
                return Ok(ApiResponse<CandidateExperienceDto>.SuccessResult(result, "Experience added successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateExperienceDto>.FailureResult(ex.Message));
            }
        }

        [HttpPut("experiences/{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateExperienceDto>>> UpdateExperience(long id, [FromBody] CandidateExperienceDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.UpdateExperienceAsync(userId, id, dto);
                return Ok(ApiResponse<CandidateExperienceDto>.SuccessResult(result, "Experience updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateExperienceDto>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("experiences/{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> DeleteExperience(long id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _profileService.DeleteExperienceAsync(userId, id);
                return Ok(ApiResponse<string>.SuccessResult("Experience deleted", "Experience removed successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        [HttpPost("educations")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateEducationDto>>> AddEducation([FromBody] CandidateEducationDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.AddEducationAsync(userId, dto);
                return Ok(ApiResponse<CandidateEducationDto>.SuccessResult(result, "Education added successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateEducationDto>.FailureResult(ex.Message));
            }
        }

        [HttpPut("educations/{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateEducationDto>>> UpdateEducation(long id, [FromBody] CandidateEducationDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.UpdateEducationAsync(userId, id, dto);
                return Ok(ApiResponse<CandidateEducationDto>.SuccessResult(result, "Education updated successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateEducationDto>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("educations/{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> DeleteEducation(long id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _profileService.DeleteEducationAsync(userId, id);
                return Ok(ApiResponse<string>.SuccessResult("Education deleted", "Education removed successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        [HttpPost("skills")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateSkillDto>>> AddSkill([FromBody] CandidateSkillDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.AddSkillAsync(userId, dto);
                return Ok(ApiResponse<CandidateSkillDto>.SuccessResult(result, "Skill added successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateSkillDto>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("skills/{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> DeleteSkill(long id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _profileService.DeleteSkillAsync(userId, id);
                return Ok(ApiResponse<string>.SuccessResult("Skill deleted", "Skill removed successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        [HttpPost("languages")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CandidateLanguageDto>>> AddLanguage([FromBody] CandidateLanguageDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _profileService.AddLanguageAsync(userId, dto);
                return Ok(ApiResponse<CandidateLanguageDto>.SuccessResult(result, "Language added successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CandidateLanguageDto>.FailureResult(ex.Message));
            }
        }

        [HttpDelete("languages/{id:long}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> DeleteLanguage(long id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _profileService.DeleteLanguageAsync(userId, id);
                return Ok(ApiResponse<string>.SuccessResult("Language deleted", "Language removed successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        [HttpPost("avatar")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> UploadAvatar([FromForm] IFormFile file)
        {
            try
            {
                var userId = GetCurrentUserId();
                var url = await _profileService.UploadAvatarAsync(userId, file);
                return Ok(ApiResponse<string>.SuccessResult(url ?? string.Empty, "Avatar uploaded successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        [HttpPost("resume")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> UploadResume([FromForm] IFormFile file)
        {
            try
            {
                var userId = GetCurrentUserId();
                var url = await _profileService.UploadResumeAsync(userId, file);
                return Ok(ApiResponse<string>.SuccessResult(url ?? string.Empty, "Resume uploaded successfully."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.FailureResult(ex.Message));
            }
        }

        #region Helpers

        private long GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("uid");
            if (long.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            throw new InvalidOperationException("User identity invalid.");
        }

        #endregion
    }
}
