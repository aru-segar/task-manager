using TaskManagerAPI.Models.Enums;

namespace TaskManagerAPI.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Title { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;

        public bool isDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        public Guid userId { get; set; }
        public User? User { get; set; }
    }
}
