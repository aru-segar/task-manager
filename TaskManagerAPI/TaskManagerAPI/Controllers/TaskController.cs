using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagerAPI.Interfaces; 
using TaskManagerAPI.Models;
using TaskManagerAPI.Responses;
using TaskManagerAPI.Exceptions;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyTasks()
        {
            try
            {
                var tasks = await _taskService.GetTasksForUserAsync(GetUserId());
                return Ok(ApiResponse<List<TaskItem>>.Ok(tasks));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResponse<object>.Fail(ex.Message, ex.StatusCode));
            }
            catch
            {
                return StatusCode(500, ApiResponse<object>.Fail("An unexpected error occurred.", 500));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
                return BadRequest(ApiResponse<object>.Fail("Title is required.", 400));

            try
            {
                task.Id = Guid.NewGuid();
                task.userId = GetUserId();
                task.CreatedAt = DateTime.UtcNow;
                task.IsCompleted = false;

                var created = await _taskService.CreateTaskAsync(task);
                return CreatedAtAction(nameof(GetMyTasks), new { id = created.Id }, ApiResponse<TaskItem>.Ok(created));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResponse<object>.Fail(ex.Message, ex.StatusCode));
            }
            catch
            {
                return StatusCode(500, ApiResponse<object>.Fail("An unexpected error occurred.", 500));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] TaskItem updated)
        {
            if (id == Guid.Empty)
                return BadRequest(ApiResponse<object>.Fail("Invalid task id.", 400));

            if (string.IsNullOrWhiteSpace(updated.Title))
                return BadRequest(ApiResponse<object>.Fail("Title is required.", 400));

            try
            {
                var existing = await _taskService.UpdateTaskAsync(new TaskItem
                {
                    Id = id,
                    Title = updated.Title,
                    IsCompleted = updated.IsCompleted
                });

                return existing == null
                    ? NotFound(ApiResponse<object>.Fail("Task not found.", 404))
                    : Ok(ApiResponse<TaskItem>.Ok(existing));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResponse<object>.Fail(ex.Message, ex.StatusCode));
            }
            catch
            {
                return StatusCode(500, ApiResponse<object>.Fail("An unexpected error occurred.", 500));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest(ApiResponse<object>.Fail("Invalid task id.", 400));

            try
            {
                var result = await _taskService.DeleteTaskAsync(id, GetUserId());
                return result
                    ? NoContent()
                    : NotFound(ApiResponse<object>.Fail("Task not found.", 404));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResponse<object>.Fail(ex.Message, ex.StatusCode));
            }
            catch
            {
                return StatusCode(500, ApiResponse<object>.Fail("An unexpected error occurred.", 500));
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateTaskStatusRequest body)
        {
            if (id == Guid.Empty)
                return BadRequest(ApiResponse<object>.Fail("Invalid task id.", 400));

            try
            {
                var updated = await _taskService.UpdateTaskStatusAsync(id, GetUserId(), body.Status);
                return updated == null
                    ? NotFound(ApiResponse<object>.Fail("Task not found or invalid status.", 404))
                    : Ok(ApiResponse<TaskItem>.Ok(updated));
            }
            catch (AppException ex)
            {
                return StatusCode(ex.StatusCode, ApiResponse<object>.Fail(ex.Message, ex.StatusCode));
            }
            catch
            {
                return StatusCode(500, ApiResponse<object>.Fail("An unexpected error occurred.", 500));
            }
        }

        public class UpdateTaskStatusRequest
        {
            public int Status {  get; set; }
        }
    }
}
