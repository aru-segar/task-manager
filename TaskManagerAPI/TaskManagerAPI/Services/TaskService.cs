using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Interfaces;
using TaskManagerAPI.Models;
using TaskManagerAPI.Models.Enums;

namespace TaskManagerAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        // Get all tasks for a specific user
        public async Task<List<TaskItem>> GetTasksForUserAsync(Guid userId)
        {
            return await _context.Tasks
                .Where(t => t.userId == userId && !t.isDeleted)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        // Create a new task
        public async Task<TaskItem> CreateTaskAsync(TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        // Update a task
        public async Task<TaskItem?> UpdateTaskAsync(TaskItem updatedTask)
        {
            var task = await _context.Tasks.FindAsync(updatedTask.Id);
            if (task == null || task.isDeleted) return null;

            task.Title = updatedTask.Title;
            task.IsCompleted = updatedTask.IsCompleted;

            await _context.SaveChangesAsync();
            return task;
        }

        // Soft delete
        public async Task<bool> DeleteTaskAsync(Guid id, Guid userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.userId == userId);

            if (task == null) return false;

            task.isDeleted = true;
            task.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TaskItem?> UpdateTaskStatusAsync(Guid taskId, Guid userId, int  status)
        {
            if (!Enum.IsDefined(typeof(TaskItemStatus), status)) return null;

            var task = await _context.Tasks .FirstOrDefaultAsync(t => t.Id == taskId && t.userId == userId && !t.isDeleted);

            if (task == null) return null;

            task.Status = (TaskItemStatus)status;

            task.IsCompleted = task.Status == TaskItemStatus.Completed;

            await _context.SaveChangesAsync();
            return task;
        }
    }
}
