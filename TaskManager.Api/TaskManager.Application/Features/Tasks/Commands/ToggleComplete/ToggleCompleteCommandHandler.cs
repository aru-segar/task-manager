using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Application.Abstractions;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Commands.ToggleComplete
{
    public class ToggleCompleteCommandHandler : IRequestHandler<ToggleCompleteCommand, TaskDto>
    {
        private readonly ITaskDbContext _db;
        private readonly IMapper _mapper;

        public ToggleCompleteCommandHandler(ITaskDbContext db, IMapper mapper)
        {
            _db = db; 
            _mapper = mapper;
        }

        public async Task<TaskDto> Handle(ToggleCompleteCommand r, CancellationToken ct)
        {
            var entity = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == r.Id, ct)
                ?? throw new KeyNotFoundException($"Task {r.Id} not found");
            entity.ToggleComplete(r.Value);
            await _db.SaveChangesAsync(ct);
            return _mapper.Map<TaskDto>(entity);
        }
    }
}
