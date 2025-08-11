using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using TaskManagerAPI.Exceptions;
using TaskManagerAPI.Interfaces; // or Services if not using interfaces
using TaskManagerAPI.Models;
using TaskManagerAPI.Responses;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(ApiResponse<object>.Fail("Validation failed.", 400, errors));
            }

            try
            {
                var result = await _authService.Register(request.Username, request.Email, request.Password);

                // If you haven't changed AuthService to throw yet, keep this:
                if (result == null)
                    return BadRequest(ApiResponse<object>.Fail("User already exists.", 409));

                return Ok(ApiResponse<object>.Ok(new { user = result }));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResponse<object>.Fail(ex.Message, ex.StatusCode));
            }
            catch
            {
                return StatusCode(500, ApiResponse<object>.Fail("An unexpected error occurred.", 500));
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(ApiResponse<object>.Fail("Validation failed.", 400, errors));
            }

            try
            {
                var user = await _authService.Login(request.Email, request.Password);

                if (user == null) // in case AuthService still returns null
                    return Unauthorized(ApiResponse<object>.Fail("Invalid credentials.", 401));

                var token = _authService.GenerateJwtToken(user);
                return Ok(ApiResponse<object>.Ok(new { token, user }));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResponse<object>.Fail(ex.Message, ex.StatusCode));
            }
            catch
            {
                return StatusCode(500, ApiResponse<object>.Fail("An unexpected error occurred.", 500));
            }
        }
    }

    // DTOs (now with basic annotations; safe, non-breaking)
    public class RegisterRequest
    {
        [Required, StringLength(100)]
        public required string Username { get; set; }

        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required, MinLength(6)]
        public required string Password { get; set; }
    }

    public class LoginRequest
    {
        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }
}
