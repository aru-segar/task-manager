using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Application.Abstractions;

namespace TaskManager.Application.Features.Tasks.Commands.DeleteTask
{
    public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand, Unit>
    {
        private readonly ITaskDbContext _db;

        public DeleteTaskCommandHandler(ITaskDbContext db) => _db = db;

        public async Task<Unit> Handle(DeleteTaskCommand r, CancellationToken ct)
        {
            var entity = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == r.Id, ct)
                ?? throw new KeyNotFoundException($"Task {r.Id} not found");
            _db.Tasks.Remove(entity);
            await _db.SaveChangesAsync(ct);
            return Unit.Value;
        }
    }
}
