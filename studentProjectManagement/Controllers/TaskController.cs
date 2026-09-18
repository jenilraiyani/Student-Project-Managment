using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<TaskDTO> _validator;

        public TaskController(AppDbContext context, IValidator<TaskDTO> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public IActionResult GetAllTasks()
        {
            try
            {
                var tasks = _context.SPM_Tasks
                    .Include(t => t.ProjectAllocation)
                    .Include(t => t.TaskStatus)
                    .Include(t => t.TaskPriority)
                    .Select(t => new TaskDTO
                    {
                        TaskID = t.TaskID,
                        TaskTitle = t.TaskTitle,
                        TaskDescription = t.TaskDescription,
                        AssignedScore = t.AssignedScore,
                        EarnedScore = t.EarnedScore,
                        ProgressPercentage = t.ProgressPercentage,
                        TaskAssignedDate = t.TaskAssignedDate,
                        TaskStartDate = t.TaskStartDate,
                        TaskDueDate = t.TaskDueDate,
                        TaskCompletedDate = t.TaskCompletedDate,
                        NextFollowUpDate = t.NextFollowUpDate,
                        FacultyRemarks = t.FacultyRemarks,
                        StudentRemarks = t.StudentRemarks,
                        ProjectAllocationID = t.ProjectAllocationID,
                        TaskStatusID = t.TaskStatusID,
                        TaskStatusName = t.TaskStatus.TaskStatusName,
                        TaskStatusCssClass = t.TaskStatus.TaskStatusCssClass,
                        TaskPriorityID = t.TaskPriorityID,
                        TaskPriorityName = t.TaskPriority.TaskPriorityName,
                        TaskPriortyCssClass = t.TaskPriority.TaskPriortyCssClass
                    })
                    .ToList();

                return Ok(new ApiResponse<List<TaskDTO>>
                {
                    Success = true,
                    Message = "Tasks retrieved successfully",
                    Data = tasks
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving tasks.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetTaskById(int id)
        {
            try
            {
                var task = _context.SPM_Tasks
                    .Include(t => t.ProjectAllocation)
                    .Include(t => t.TaskStatus)
                    .Include(t => t.TaskPriority)
                    .Where(t => t.TaskID == id)
                    .Select(t => new TaskDTO
                    {
                        TaskID = t.TaskID,
                        TaskTitle = t.TaskTitle,
                        TaskDescription = t.TaskDescription,
                        AssignedScore = t.AssignedScore,
                        EarnedScore = t.EarnedScore,
                        ProgressPercentage = t.ProgressPercentage,
                        TaskAssignedDate = t.TaskAssignedDate,
                        TaskStartDate = t.TaskStartDate,
                        TaskDueDate = t.TaskDueDate,
                        TaskCompletedDate = t.TaskCompletedDate,
                        NextFollowUpDate = t.NextFollowUpDate,
                        FacultyRemarks = t.FacultyRemarks,
                        StudentRemarks = t.StudentRemarks,
                        ProjectAllocationID = t.ProjectAllocationID,
                        TaskStatusID = t.TaskStatusID,
                        TaskStatusName = t.TaskStatus.TaskStatusName,
                        TaskStatusCssClass = t.TaskStatus.TaskStatusCssClass,
                        TaskPriorityID = t.TaskPriorityID,
                        TaskPriorityName = t.TaskPriority.TaskPriorityName,
                        TaskPriortyCssClass = t.TaskPriority.TaskPriortyCssClass
                    })
                    .FirstOrDefault();

                if (task == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Task not found",
                        Errors = new List<string> { "The task with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<TaskDTO>
                {
                    Success = true,
                    Message = "Task retrieved successfully",
                    Data = task
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the task.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddTask(TaskDTO taskDto)
        {
            var result = await _validator.ValidateAsync(taskDto);
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
                var task = new SPM_Task
                {
                    TaskTitle = taskDto.TaskTitle,
                    TaskDescription = taskDto.TaskDescription,
                    AssignedScore = taskDto.AssignedScore,
                    EarnedScore = taskDto.EarnedScore,
                    ProgressPercentage = taskDto.ProgressPercentage,
                    TaskAssignedDate = taskDto.TaskAssignedDate,
                    TaskStartDate = taskDto.TaskStartDate,
                    TaskDueDate = taskDto.TaskDueDate,
                    TaskCompletedDate = taskDto.TaskCompletedDate,
                    NextFollowUpDate = taskDto.NextFollowUpDate,
                    FacultyRemarks = taskDto.FacultyRemarks,
                    StudentRemarks = taskDto.StudentRemarks,
                    ProjectAllocationID = taskDto.ProjectAllocationID,
                    TaskStatusID = taskDto.TaskStatusID,
                    TaskPriorityID = taskDto.TaskPriorityID
                };

                _context.SPM_Tasks.Add(task);
                _context.SaveChanges();

                taskDto.TaskID = task.TaskID;

                return Ok(new ApiResponse<TaskDTO>
                {
                    Success = true,
                    Message = "Task created successfully",
                    Data = taskDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the task.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskDTO taskDto)
        {
            var result = await _validator.ValidateAsync(taskDto);
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
                if (id != taskDto.TaskID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var task = new SPM_Task
                {
                    TaskID = taskDto.TaskID,
                    TaskTitle = taskDto.TaskTitle,
                    TaskDescription = taskDto.TaskDescription,
                    AssignedScore = taskDto.AssignedScore,
                    EarnedScore = taskDto.EarnedScore,
                    ProgressPercentage = taskDto.ProgressPercentage,
                    TaskAssignedDate = taskDto.TaskAssignedDate,
                    TaskStartDate = taskDto.TaskStartDate,
                    TaskDueDate = taskDto.TaskDueDate,
                    TaskCompletedDate = taskDto.TaskCompletedDate,
                    NextFollowUpDate = taskDto.NextFollowUpDate,
                    FacultyRemarks = taskDto.FacultyRemarks,
                    StudentRemarks = taskDto.StudentRemarks,
                    ProjectAllocationID = taskDto.ProjectAllocationID,
                    TaskStatusID = taskDto.TaskStatusID,
                    TaskPriorityID = taskDto.TaskPriorityID
                };

                _context.SPM_Tasks.Update(task);
                _context.SaveChanges();

                return Ok(new ApiResponse<TaskDTO>
                {
                    Success = true,
                    Message = "Task updated successfully",
                    Data = taskDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the task.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            try
            {
                var task = _context.SPM_Tasks.Find(id);

                if (task == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The task with the provided ID does not exist." }
                    });
                }

                _context.SPM_Tasks.Remove(task);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Task deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the task.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}