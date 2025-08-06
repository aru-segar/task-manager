using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TaskController(TaskService taskService)
        {
            _taskService = taskService;
        }

        // Helper: Get logged-in UserId from JWT
        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
        }

        // Get tasks
        [HttpGet]
        public async Task<IActionResult> GetMyTasks()
        {
            var tasks = await _taskService.GetTasksForUserAsync(GetUserId());
            return Ok(tasks);
        }

        // Create task
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskItem task)
        {
            task.Id = Guid.NewGuid();
            task.userId = GetUserId();
            task.CreatedAt = DateTime.UtcNow;
            task.IsCompleted = false;

            var created = await _taskService.CreateTaskAsync(task);
            return CreatedAtAction(nameof(GetMyTasks), new { id = created.Id }, created);
        }

        // Update task
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] TaskItem updated)
        {
            var existing = await _taskService.UpdateTaskAsync(new TaskItem
            {
                Id = id,
                Title = updated.Title,
                IsCompleted = updated.IsCompleted
            });

            return existing == null ? NotFound() : Ok(existing);
        }

        // Soft delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _taskService.DeleteTaskAsync(id, GetUserId());
            return result ? NoContent() : NotFound();
        }
    }
}
