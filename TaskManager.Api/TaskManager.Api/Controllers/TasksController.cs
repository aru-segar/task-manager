using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Features.Tasks.Commands.CreateTask;
using TaskManager.Application.Features.Tasks.Commands.DeleteTask;
using TaskManager.Application.Features.Tasks.Commands.ToggleComplete;
using TaskManager.Application.Features.Tasks.Commands.UpdateTask;
using TaskManager.Application.Features.Tasks.Queries.GetTaskById;
using TaskManager.Application.Features.Tasks.Queries.GetTasks;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly IMediator _mediator;
        public TasksController(IMediator mediator) => _mediator = mediator;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] bool? isCompleted, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
            => Ok(await _mediator.Send(new GetTasksQuery(isCompleted, page, pageSize)));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
            => Ok(await _mediator.Send(new GetTaskByIdQuery(id)));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskCommand cmd)
        {
            var created = await _mediator.Send(cmd);
            return CreatedAtAction(nameof(GetById), new { id =  created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskCommand body)
            => Ok(await _mediator.Send(body with { Id = id }));

        [HttpPatch("{id:guid}/toggle")]
        public async Task<IActionResult> Toggle(Guid id, [FromQuery] bool? value)
            => Ok(await _mediator.Send(new ToggleCompleteCommand(id, value)));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteTaskCommand(id));
            return NoContent();
        }
    }
}
