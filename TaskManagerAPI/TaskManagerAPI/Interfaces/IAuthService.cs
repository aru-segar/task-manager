using TaskManagerAPI.Models;

namespace TaskManagerAPI.Interfaces
{
    public interface IAuthService
    {
        Task<User?> Register(string username, string email, string password);
        Task<User?> Login(string email, string password);
        string GenerateJwtToken(User user);
    }
}
