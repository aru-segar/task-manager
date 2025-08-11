namespace TaskManagerAPI.Exceptions
{
    public class UserAlreadyExistsException : AppException
    {
        public UserAlreadyExistsException()
            : base("A user with this email already exists.", 409) { }
    }
}
