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
    public class TaskStatusController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<TaskStatusDTO> _validator;

        public TaskStatusController(AppDbContext context, IValidator<TaskStatusDTO> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public IActionResult GetAllTaskStatuses()
        {
            try
            {
                var statuses = _context.SPM_TaskStatuses
                    .Select(ts => new TaskStatusDTO
                    {
                        TaskStatusID = ts.TaskStatusID,
                        TaskStatusName = ts.TaskStatusName,
                        TaskStatusCssClass = ts.TaskStatusCssClass
                    })
                    .ToList();

                return Ok(new ApiResponse<List<TaskStatusDTO>>
                {
                    Success = true,
                    Message = "Task Statuses retrieved successfully",
                    Data = statuses
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving task statuses.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("dropdown")]
        public IActionResult GetTaskStatusesDropdown()
        {
            try
            {
                var statuses = _context.SPM_TaskStatuses
                    .Select(s => new TaskStatusDTO
                    {
                        TaskStatusID = s.TaskStatusID,
                        TaskStatusName = s.TaskStatusName
                    })
                    .ToList();

                return Ok(new ApiResponse<List<TaskStatusDTO>>
                {
                    Success = true,
                    Message = "Task Statuses retrieved successfully",
                    Data = statuses
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
        public IActionResult GetTaskStatusById(int id)
        {
            try
            {
                var status = _context.SPM_TaskStatuses
                    .Where(ts => ts.TaskStatusID == id)
                    .Select(ts => new TaskStatusDTO
                    {
                        TaskStatusID = ts.TaskStatusID,
                        TaskStatusName = ts.TaskStatusName,
                        TaskStatusCssClass = ts.TaskStatusCssClass
                    })
                    .FirstOrDefault();

                if (status == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Task Status not found",
                        Errors = new List<string> { "The task status with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<TaskStatusDTO>
                {
                    Success = true,
                    Message = "Task Status retrieved successfully",
                    Data = status
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the task status.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddTaskStatus(TaskStatusDTO taskStatusDto)
        {
            var result = await _validator.ValidateAsync(taskStatusDto);
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
                var taskStatus = new SPM_TaskStatus
                {
                    TaskStatusName = taskStatusDto.TaskStatusName,
                    TaskStatusCssClass = taskStatusDto.TaskStatusCssClass
                };

                _context.SPM_TaskStatuses.Add(taskStatus);
                _context.SaveChanges();

                taskStatusDto.TaskStatusID = taskStatus.TaskStatusID;

                return Ok(new ApiResponse<TaskStatusDTO>
                {
                    Success = true,
                    Message = "Task Status created successfully",
                    Data = taskStatusDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the task status.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaskStatus(int id, TaskStatusDTO taskStatusDto)
        {
            var result = await _validator.ValidateAsync(taskStatusDto);
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
                if (id != taskStatusDto.TaskStatusID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var taskStatus = new SPM_TaskStatus
                {
                    TaskStatusID = taskStatusDto.TaskStatusID,
                    TaskStatusName = taskStatusDto.TaskStatusName,
                    TaskStatusCssClass = taskStatusDto.TaskStatusCssClass
                };

                _context.SPM_TaskStatuses.Update(taskStatus);
                _context.SaveChanges();

                return Ok(new ApiResponse<TaskStatusDTO>
                {
                    Success = true,
                    Message = "Task Status updated successfully",
                    Data = taskStatusDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the task status.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTaskStatus(int id)
        {
            try
            {
                var status = _context.SPM_TaskStatuses.Find(id);

                if (status == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The task status with the provided ID does not exist." }
                    });
                }

                _context.SPM_TaskStatuses.Remove(status);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Task Status deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the task status.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}