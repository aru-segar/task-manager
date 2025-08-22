using MediatR;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Queries.GetTasks
{
    public record GetTasksQuery(bool? IsCompleted = null, int Page = 1, int PageSize = 20)
     : IRequest<IReadOnlyList<TaskDto>>;
}
