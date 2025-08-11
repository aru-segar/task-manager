namespace TaskManagerAPI.Responses
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public ApiError? Error { get; set; }

        public static ApiResponse<T> Ok(T data) => new() { Success = true, Data = data };

        public static ApiResponse<T> Fail(string message, int? code = null, IDictionary<string, string[]>? details = null) =>
            new()
            {
                Success = false,
                Error = new ApiError
                {
                    Message = message,
                    Code = code,
                    Details = details
                }
            };
    }

    public class ApiError
    {
        public int? Code { get; set; }                       // HTTP status like 400/401/409
        public string Message { get; set; } = string.Empty;  // Human-readable message
        public IDictionary<string, string[]>? Details { get; set; } // Field errors (validation)
    }
}
