namespace AiRecruitmentPlatform.Application.DTOs.Common
{
    public class ApiResponse<T>
    {
        public T? Data { get; set; }
        public string? Message { get; set; }
        public bool Success { get; set; }

        public static ApiResponse<T> SuccessResult(T data, string? message = null)
        {
            return new ApiResponse<T>
            {
                Data = data,
                Message = message,
                Success = true
            };
        }

        public static ApiResponse<T> FailureResult(string message)
        {
            return new ApiResponse<T>
            {
                Data = default,
                Message = message,
                Success = false
            };
        }
    }
}
