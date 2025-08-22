using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Application.Abstractions;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Queries.GetTaskById
{
    public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, TaskDto>
    {
        private readonly ITaskDbContext _db;
        private readonly IMapper _mapper;

        public GetTaskByIdQueryHandler(ITaskDbContext db, IMapper mapper)
        {
            _db = db; 
            _mapper = mapper;
        }

        public async Task<TaskDto> Handle(GetTaskByIdQuery r, CancellationToken ct)
            => await _db.Tasks
                .Where(t => t.Id == r.Id)
                .ProjectTo<TaskDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(ct)
                ?? throw new KeyNotFoundException($"Task {r.Id} not found");
    }
}
