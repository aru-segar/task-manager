using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManager.Domain.Entities;

namespace TaskManager.Infrastructure.Persistence.Configurations
{
    public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
    {
        public void Configure(EntityTypeBuilder<TaskItem> b)
        {
            b.HasKey(x => x.Id);

            b.Property(x => x.Title).IsRequired().HasMaxLength(160);

            b.Property(x => x.Description).HasMaxLength(2000);

            b.Property(x => x.IsCompleted);

            b.Property(x => x.CreatedUtc).HasConversion(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            b.Property(x => x.UpdatedUtc).HasConversion(v => v, v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);

            b.HasIndex(x => new { x.IsCompleted, x.DueUtc });
        }
    }
}
