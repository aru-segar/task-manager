using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManager.Application.Abstractions;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Queries.GetTasks
{
    public class GetTasksQueryHandler : IRequestHandler<GetTasksQuery, IReadOnlyList<TaskDto>>
    {
        private readonly ITaskDbContext _db;
        private readonly IMapper _mapper;

        public GetTasksQueryHandler(ITaskDbContext db, IMapper mapper)
        {
            _db = db; 
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<TaskDto>> Handle(GetTasksQuery r, CancellationToken ct)
        {
            var q = _db.Tasks.AsQueryable();
            if (r.IsCompleted is not null) q = q.Where(t => t.IsCompleted == r.IsCompleted);

            return await q.OrderByDescending(t => t.CreatedUtc)
                .Skip((r.Page - 1) * r.PageSize)
                .Take(r.PageSize)
                .ProjectTo<TaskDto>(_mapper.ConfigurationProvider)
                .ToListAsync(ct);
        }
    }
}
