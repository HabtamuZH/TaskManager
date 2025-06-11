using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        
        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] TaskFilterDto filter)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }
            
            var tasks = await _taskService.GetTasksAsync(userId, filter);
            return Ok(tasks);
        }
        
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllTasks([FromQuery] TaskFilterDto filter)
        {
            var tasks = await _taskService.GetAllTasksAsync(filter);
            return Ok(tasks);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }
            
            var task = await _taskService.GetTaskByIdAsync(id, userId);
            
            if (task == null)
            {
                return NotFound();
            }
            
            return Ok(task);
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var userIdClaim = User.FindFirst("userId")?.Value;
            
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }
            
            var task = await _taskService.CreateTaskAsync(createTaskDto, userId);
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto updateTaskDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var userIdClaim = User.FindFirst("userId")?.Value;
            
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }
            
            var task = await _taskService.UpdateTaskAsync(id, updateTaskDto, userId);
            
            if (task == null)
            {
                return NotFound();
            }
            
            return Ok(task);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }
            
            var success = await _taskService.DeleteTaskAsync(id, userId);
            
            if (!success)
            {
                return NotFound();
            }
            
            return NoContent();
        }
        
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateTaskStatusDto statusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var userIdClaim = User.FindFirst("userId")?.Value;
            
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }
            
            // Get the current task
            var currentTask = await _taskService.GetTaskByIdAsync(id, userId);
            if (currentTask == null)
            {
                return NotFound();
            }
            
            // Create update DTO with only status changed
            var updateDto = new UpdateTaskDto
            {
                Title = currentTask.Title,
                Description = currentTask.Description,
                Status = statusDto.Status,
                Priority = currentTask.Priority,
                DueDate = currentTask.DueDate
            };
            
            var task = await _taskService.UpdateTaskAsync(id, updateDto, userId);
            
            if (task == null)
            {
                return NotFound();
            }
            
            return Ok(task);
        }
    }
}

