using AutoMapper;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Mappings
{
    public class TaskProfile : Profile
    {
        public TaskProfile() 
        {
            CreateMap<TaskItem, TaskDto>();
        }
    }
}
