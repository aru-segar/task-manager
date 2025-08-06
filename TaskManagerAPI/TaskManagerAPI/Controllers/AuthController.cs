using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Services;
using TaskManagerAPI.Models;
namespace TaskManagerAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var result = await _authService.Register(user.Username, user.Email, user.PasswordHash);
            if (result == null)
                return BadRequest("User already exists.");
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            var result = await _authService.Login(login.Email, login.PasswordHash);
            if (result == null)
                return Unauthorized("Invalid credentials.");

            var token = _authService.GenerateJwtToken(result);
            return Ok(new
            {
                token,
                user = result
            });
        }
    }
}
