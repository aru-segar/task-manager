using System.Net;
using TaskManagerAPI.Exceptions;
using TaskManagerAPI.Responses;

namespace TaskManagerAPI.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.StatusCode = ex.StatusCode;
                await context.Response.WriteAsJsonAsync(ApiResponse<object>.Fail(ex.Message, ex.StatusCode));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                var status = (int)HttpStatusCode.InternalServerError;
                context.Response.StatusCode = status;
                await context.Response.WriteAsJsonAsync(ApiResponse<object>.Fail("An unexpected error occurred.", status));
            }
        }
    }
}
