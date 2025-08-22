using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Application.Abstractions;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Commands.UpdateTask
{
    public class UpdateTaskCommandHandler : IRequestHandler<UpdateTaskCommand, TaskDto>
    {
        private readonly ITaskDbContext _db;
        private readonly IMapper _mapper;

        public UpdateTaskCommandHandler(ITaskDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<TaskDto> Handle(UpdateTaskCommand r, CancellationToken ct)
        {
            var entity = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == r.Id, ct)
                ?? throw new KeyNotFoundException($"Task {r.Id} not found");
            entity.Update(r.Title, r.Description, r.DueUtc);
            await _db.SaveChangesAsync(ct);
            return _mapper.Map<TaskDto>(entity);
        }
    }
}
