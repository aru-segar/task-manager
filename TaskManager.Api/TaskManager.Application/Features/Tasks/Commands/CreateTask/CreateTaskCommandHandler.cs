using AutoMapper;
using MediatR;
using TaskManager.Application.Abstractions;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Features.Tasks.Commands.CreateTask
{
    public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, TaskDto>
    {
        private readonly ITaskDbContext _db;
        private readonly IMapper _mapper;

        public CreateTaskCommandHandler(ITaskDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<TaskDto> Handle(CreateTaskCommand r, CancellationToken ct)
        {
            var entity = new TaskItem(r.Title, r.Description, r.DueUtc);
            await _db.Tasks.AddAsync(entity, ct);
            await _db.SaveChangesAsync(ct);
            return _mapper.Map<TaskDto>(entity);
        }
    }
}
