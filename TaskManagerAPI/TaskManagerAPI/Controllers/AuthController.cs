using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using TaskManagerAPI.Interfaces;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;

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
            var result = await _authService.Register(request.Username, request.Email, request.Password);
            if (result == null)
                return BadRequest("User already exists.");

            return Ok(result);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _authService.Login(request.Email, request.Password);
            if (user == null)
                return Unauthorized("Invalid credentials.");

            var token = _authService.GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user
            });
        }
    }

    // DTOs for cleaner API contracts
    public class RegisterRequest
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = null;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = null;
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null;

        [Required]
        public string Password { get; set; } = null;
    }
}
