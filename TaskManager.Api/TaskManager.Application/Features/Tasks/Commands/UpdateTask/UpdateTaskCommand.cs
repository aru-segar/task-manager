using MediatR;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Commands.UpdateTask
{
    public record UpdateTaskCommand(Guid Id, string Title, string? Description, DateTime? DueUtc) : IRequest<TaskDto>;
}
