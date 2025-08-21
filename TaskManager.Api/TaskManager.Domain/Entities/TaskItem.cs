using TaskManager.Domain.Common;

namespace TaskManager.Domain.Entities
{
    public class TaskItem : BaseEntity
    {
        // Private setters enforce invariants through methods
        public string Title { get; private set; } = default!;
        public string? Description { get; private set; }
        public DateTime? DueUtc { get; private set; }
        public bool IsCompleted { get; private set; }

        // Constructor to ensure valid object is set
        public TaskItem(string title, string? description = null, DateTime? dueUtc = null)
        {
            SetTitle(title);
            SetDescription(description);
            SetDue(dueUtc);
            TouchUpdated();
        }

        // Behaviour methods
        public void Update(string title, string? description, DateTime? dueUtc)
        {
            SetTitle(title);
            SetDescription(description);
            SetDue(dueUtc);
            TouchUpdated();
        }

        public void ToggleComplete(bool? value = null)
        {
            IsCompleted = value ?? !IsCompleted;
            TouchUpdated();
        }

        // Guarded setters 
        private void SetTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title cannot be empty.", nameof(title));

            title = title.Trim();
            if (title.Length > 160)
                throw new ArgumentException("Title must be 160 characters or fewer.", nameof(title));

            Title = title;
        }

        private void SetDescription(string? description)
        {
            if (string.IsNullOrWhiteSpace(description))
            {
                Description = null;
                return;
            }

            description = description.Trim();
            if (description.Length > 2000)
                throw new ArgumentException("Description must be 2000 characters or fewer.", nameof(description));

            Description = description;
        }

        private void SetDue(DateTime? dueUtc)
        {
            DueUtc = dueUtc;
        }
    }
}
