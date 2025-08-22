using MediatR;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Commands.ToggleComplete
{
    public record ToggleCompleteCommand(Guid Id, bool? Value = null) : IRequest<TaskDto>;
}
