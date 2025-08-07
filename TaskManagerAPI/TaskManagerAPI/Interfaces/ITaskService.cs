using TaskManagerAPI.Models;

namespace TaskManagerAPI.Interfaces
{
    public interface ITaskService
    {
        Task<List<TaskItem>> GetTasksForUserAsync(Guid userId);
        Task<TaskItem> CreateTaskAsync(TaskItem task);
        Task<TaskItem?> UpdateTaskAsync(TaskItem updatedTask);
        Task<bool> DeleteTaskAsync(Guid taskId, Guid userId);
    }
}
