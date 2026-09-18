using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using studentProjectManagement.Common;
using studentProjectManagement.Data;
using studentProjectManagement.DTOs; 
using studentProjectManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace studentProjectManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskPriorityController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<TaskPriorityDTO> _validator;

        public TaskPriorityController(AppDbContext context, IValidator<TaskPriorityDTO> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public IActionResult GetAllTaskPriorities()
        {
            try
            {
                var priorities = _context.SPM_TaskPriorities
                    .Select(tp => new TaskPriorityDTO
                    {
                        TaskPriorityID = tp.TaskPriorityID,
                        TaskPriorityName = tp.TaskPriorityName,
                        TaskPriortyCssClass = tp.TaskPriortyCssClass
                    })
                    .ToList();

                return Ok(new ApiResponse<List<TaskPriorityDTO>>
                {
                    Success = true,
                    Message = "Task Priorities retrieved successfully",
                    Data = priorities
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving task priorities.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("dropdown")]
        public IActionResult GetTaskPrioritiesDropdown()
        {
            try
            {
                var priorities = _context.SPM_TaskPriorities
                    .Select(p => new TaskPriorityDTO
                    {
                        TaskPriorityID = p.TaskPriorityID,
                        TaskPriorityName = p.TaskPriorityName
                    })
                    .ToList();

                return Ok(new ApiResponse<List<TaskPriorityDTO>>
                {
                    Success = true,
                    Message = "Task Priorities retrieved successfully",
                    Data = priorities
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetTaskPriorityById(int id)
        {
            try
            {
                var priority = _context.SPM_TaskPriorities
                    .Where(tp => tp.TaskPriorityID == id)
                    .Select(tp => new TaskPriorityDTO
                    {
                        TaskPriorityID = tp.TaskPriorityID,
                        TaskPriorityName = tp.TaskPriorityName,
                        TaskPriortyCssClass = tp.TaskPriortyCssClass
                    })
                    .FirstOrDefault();

                if (priority == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Task Priority not found",
                        Errors = new List<string> { "The task priority with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<TaskPriorityDTO>
                {
                    Success = true,
                    Message = "Task Priority retrieved successfully",
                    Data = priority
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the task priority.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddTaskPriority(TaskPriorityDTO taskPriorityDto)
        {
            var result = await _validator.ValidateAsync(taskPriorityDto);
            if (!result.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation Failed",
                    Data = null,
                    Errors = result.Errors.Select(x => $"{x.PropertyName}: {x.ErrorMessage}").ToList()
                });
            }

            try
            {
                var taskPriority = new SPM_TaskPriority
                {
                    TaskPriorityName = taskPriorityDto.TaskPriorityName,
                    TaskPriortyCssClass = taskPriorityDto.TaskPriortyCssClass
                };

                _context.SPM_TaskPriorities.Add(taskPriority);
                _context.SaveChanges();

                taskPriorityDto.TaskPriorityID = taskPriority.TaskPriorityID;

                return Ok(new ApiResponse<TaskPriorityDTO>
                {
                    Success = true,
                    Message = "Task Priority created successfully",
                    Data = taskPriorityDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the task priority.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaskPriority(int id, TaskPriorityDTO taskPriorityDto)
        {
            var result = await _validator.ValidateAsync(taskPriorityDto);
            if (!result.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation Failed",
                    Data = null,
                    Errors = result.Errors.Select(x => $"{x.PropertyName}: {x.ErrorMessage}").ToList()
                });
            }

            try
            {
                if (id != taskPriorityDto.TaskPriorityID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var taskPriority = new SPM_TaskPriority
                {
                    TaskPriorityID = taskPriorityDto.TaskPriorityID,
                    TaskPriorityName = taskPriorityDto.TaskPriorityName,
                    TaskPriortyCssClass = taskPriorityDto.TaskPriortyCssClass
                };

                _context.SPM_TaskPriorities.Update(taskPriority);
                _context.SaveChanges();

                return Ok(new ApiResponse<TaskPriorityDTO>
                {
                    Success = true,
                    Message = "Task Priority updated successfully",
                    Data = taskPriorityDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the task priority.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTaskPriority(int id)
        {
            try
            {
                var priority = _context.SPM_TaskPriorities.Find(id);

                if (priority == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The task priority with the provided ID does not exist." }
                    });
                }

                _context.SPM_TaskPriorities.Remove(priority);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Task Priority deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the task priority.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}