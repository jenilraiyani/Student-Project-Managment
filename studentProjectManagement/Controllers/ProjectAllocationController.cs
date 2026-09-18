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
    public class ProjectAllocationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<ProjectAllocationDTO> _validator;

        public ProjectAllocationController(AppDbContext context, IValidator<ProjectAllocationDTO> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public IActionResult GetAllProjectAllocations()
        {
            try
            {
                var allocations = _context.SPM_ProjectAllocations
                    .Include(pa => pa.ProjectMaster)
                    .Include(pa => pa.Student)
                    .Include(pa => pa.Faculty)
                    .Select(pa => new ProjectAllocationDTO
                    {
                        ProjectAllocationID = pa.ProjectAllocationID,
                        AssignedDate = pa.AssignedDate,
                        ProjectStartDate = pa.ProjectStartDate,
                        ProjectEndDate = pa.ProjectEndDate,
                        TotalTasksGiven = pa.TotalTasksGiven,
                        TotalCompletedTasks = pa.TotalCompletedTasks,
                        ProgressPercentage = pa.ProgressPercentage,
                        OverAllGrade = pa.OverAllGrade,
                        ProjectID = pa.ProjectID,
                        ProjectTitle = pa.ProjectMaster.ProjectTitle,
                        StudentID = pa.StudentID,
                        StudentName = pa.Student.FullName,
                        FacultyID = pa.FacultyID,
                        FacultyName = pa.Faculty.FullName
                    })
                    .ToList();

                return Ok(new ApiResponse<List<ProjectAllocationDTO>>
                {
                    Success = true,
                    Message = "Project Allocations retrieved successfully",
                    Data = allocations
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving project allocations.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetProjectAllocationById(int id)
        {
            try
            {
                var allocation = _context.SPM_ProjectAllocations
                    .Include(pa => pa.ProjectMaster)
                    .Include(pa => pa.Student)
                    .Include(pa => pa.Faculty)
                    .Where(pa => pa.ProjectAllocationID == id)
                    .Select(pa => new ProjectAllocationDTO
                    {
                        ProjectAllocationID = pa.ProjectAllocationID,
                        AssignedDate = pa.AssignedDate,
                        ProjectStartDate = pa.ProjectStartDate,
                        ProjectEndDate = pa.ProjectEndDate,
                        TotalTasksGiven = pa.TotalTasksGiven,
                        TotalCompletedTasks = pa.TotalCompletedTasks,
                        ProgressPercentage = pa.ProgressPercentage,
                        OverAllGrade = pa.OverAllGrade,
                        ProjectID = pa.ProjectID,
                        ProjectTitle = pa.ProjectMaster.ProjectTitle,
                        StudentID = pa.StudentID,
                        StudentName = pa.Student.FullName,
                        FacultyID = pa.FacultyID,
                        FacultyName = pa.Faculty.FullName
                    })
                    .FirstOrDefault();

                if (allocation == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Project Allocation not found",
                        Errors = new List<string> { "The project allocation with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<ProjectAllocationDTO>
                {
                    Success = true,
                    Message = "Project Allocation retrieved successfully",
                    Data = allocation
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the project allocation.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddProjectAllocation(ProjectAllocationDTO projectAllocationDto)
        {
            var result = await _validator.ValidateAsync(projectAllocationDto);
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
                var projectAllocation = new SPM_ProjectAllocation
                {
                    AssignedDate = projectAllocationDto.AssignedDate,
                    ProjectStartDate = projectAllocationDto.ProjectStartDate,
                    ProjectEndDate = projectAllocationDto.ProjectEndDate,
                    TotalTasksGiven = projectAllocationDto.TotalTasksGiven,
                    TotalCompletedTasks = projectAllocationDto.TotalCompletedTasks,
                    ProgressPercentage = projectAllocationDto.ProgressPercentage,
                    OverAllGrade = projectAllocationDto.OverAllGrade,
                    ProjectID = projectAllocationDto.ProjectID,
                    StudentID = projectAllocationDto.StudentID,
                    FacultyID = projectAllocationDto.FacultyID
                };

                _context.SPM_ProjectAllocations.Add(projectAllocation);
                _context.SaveChanges();

                projectAllocationDto.ProjectAllocationID = projectAllocation.ProjectAllocationID;

                return Ok(new ApiResponse<ProjectAllocationDTO>
                {
                    Success = true,
                    Message = "Project Allocation created successfully",
                    Data = projectAllocationDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the project allocation.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectAllocation(int id, ProjectAllocationDTO projectAllocationDto)
        {
            var result = await _validator.ValidateAsync(projectAllocationDto);
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
                if (id != projectAllocationDto.ProjectAllocationID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var projectAllocation = new SPM_ProjectAllocation
                {
                    ProjectAllocationID = projectAllocationDto.ProjectAllocationID,
                    AssignedDate = projectAllocationDto.AssignedDate,
                    ProjectStartDate = projectAllocationDto.ProjectStartDate,
                    ProjectEndDate = projectAllocationDto.ProjectEndDate,
                    TotalTasksGiven = projectAllocationDto.TotalTasksGiven,
                    TotalCompletedTasks = projectAllocationDto.TotalCompletedTasks,
                    ProgressPercentage = projectAllocationDto.ProgressPercentage,
                    OverAllGrade = projectAllocationDto.OverAllGrade,
                    ProjectID = projectAllocationDto.ProjectID,
                    StudentID = projectAllocationDto.StudentID,
                    FacultyID = projectAllocationDto.FacultyID
                };

                _context.SPM_ProjectAllocations.Update(projectAllocation);
                _context.SaveChanges();

                return Ok(new ApiResponse<ProjectAllocationDTO>
                {
                    Success = true,
                    Message = "Project Allocation updated successfully",
                    Data = projectAllocationDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the project allocation.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProjectAllocation(int id)
        {
            try
            {
                var allocation = _context.SPM_ProjectAllocations.Find(id);

                if (allocation == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The project allocation with the provided ID does not exist." }
                    });
                }

                _context.SPM_ProjectAllocations.Remove(allocation);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Project Allocation deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the project allocation.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}