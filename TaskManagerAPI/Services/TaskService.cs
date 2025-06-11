using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetTasksAsync(int userId, TaskFilterDto filter);
        Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId);
        Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto, int userId);
        Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId);
        Task<bool> DeleteTaskAsync(int taskId, int userId);
        Task<IEnumerable<TaskDto>> GetAllTasksAsync(TaskFilterDto filter); // For admin
    }
    
    public class TaskService : ITaskService
    {
        private readonly TaskManagerDbContext _context;
        
        public TaskService(TaskManagerDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<TaskDto>> GetTasksAsync(int userId, TaskFilterDto filter)
        {
            var query = _context.Tasks
                .Include(t => t.User)
                .Where(t => t.UserId == userId)
                .AsQueryable();
            
            query = ApplyFilters(query, filter);
            
            var tasks = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
            
            return tasks.Select(MapToTaskDto);
        }
        
        public async Task<IEnumerable<TaskDto>> GetAllTasksAsync(TaskFilterDto filter)
        {
            var query = _context.Tasks
                .Include(t => t.User)
                .AsQueryable();
            
            query = ApplyFilters(query, filter);
            
            var tasks = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
            
            return tasks.Select(MapToTaskDto);
        }
        
        public async Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
            
            return task != null ? MapToTaskDto(task) : null;
        }
        
        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto, int userId)
        {
            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                Priority = createTaskDto.Priority,
                DueDate = createTaskDto.DueDate,
                Status = Models.TaskStatus.Pending,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            
            // Load the user for the response
            await _context.Entry(task)
                .Reference(t => t.User)
                .LoadAsync();
            
            return MapToTaskDto(task);
        }
        
        public async Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId)
        {
            var task = await _context.Tasks
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
            
            if (task == null)
                return null;
            
            task.Title = updateTaskDto.Title;
            task.Description = updateTaskDto.Description;
            task.Status = updateTaskDto.Status;
            task.Priority = updateTaskDto.Priority;
            task.DueDate = updateTaskDto.DueDate;
            task.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return MapToTaskDto(task);
        }
        
        public async Task<bool> DeleteTaskAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
            
            if (task == null)
                return false;
            
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            
            return true;
        }
        
        private IQueryable<TaskItem> ApplyFilters(IQueryable<TaskItem> query, TaskFilterDto filter)
        {
            if (filter.Status.HasValue)
                query = query.Where(t => t.Status == filter.Status.Value);
            
            if (filter.Priority.HasValue)
                query = query.Where(t => t.Priority == filter.Priority.Value);
            
            if (filter.DueDateFrom.HasValue)
                query = query.Where(t => t.DueDate >= filter.DueDateFrom.Value);
            
            if (filter.DueDateTo.HasValue)
                query = query.Where(t => t.DueDate <= filter.DueDateTo.Value);
            
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var searchTerm = filter.Search.ToLower();
                query = query.Where(t => t.Title.ToLower().Contains(searchTerm) ||
                                        t.Description.ToLower().Contains(searchTerm));
            }
            
            return query;
        }
        
        private TaskDto MapToTaskDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                UserId = task.UserId,
                UserName = $"{task.User.FirstName} {task.User.LastName}"
            };
        }
    }
}

