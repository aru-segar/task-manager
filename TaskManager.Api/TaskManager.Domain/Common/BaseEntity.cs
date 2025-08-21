namespace TaskManager.Domain.Common
{
    // This class contains shared properties
    public abstract class BaseEntity
    {
        public Guid Id { get; private set; } = Guid.NewGuid();

        // Track when the entity was created/updated 
        public DateTime CreatedUtc { get; private set; } = DateTime.UtcNow;
        public DateTime? UpdatedUtc { get; private set;} 

        // Helper to set UpdatedUtc from inheritors when state changes
        protected void TouchUpdated()
        {
            UpdatedUtc = DateTime.UtcNow;
        }
    }
}
