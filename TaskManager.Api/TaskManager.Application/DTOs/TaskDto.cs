namespace TaskManager.Application.DTOs
{
    public record TaskDto(
        Guid Id,
        string Title,
        string? Description,
        DateTime? DueUtc,
        bool IsCompleted,
        DateTime CreatedUtc,
        DateTime? UpdatedUtc
    );
}
