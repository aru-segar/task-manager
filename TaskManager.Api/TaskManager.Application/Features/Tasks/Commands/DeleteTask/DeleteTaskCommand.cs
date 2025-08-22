using MediatR;

namespace TaskManager.Application.Features.Tasks.Commands.DeleteTask
{
    public record DeleteTaskCommand(Guid Id) : IRequest<Unit>;
}
