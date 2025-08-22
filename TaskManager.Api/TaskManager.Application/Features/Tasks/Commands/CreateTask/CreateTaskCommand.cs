using MediatR;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Commands.CreateTask
{
    public record CreateTaskCommand(string Title, string? Description, DateTime? DueUtc) : IRequest<TaskDto>;
}
