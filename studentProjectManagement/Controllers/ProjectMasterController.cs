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
    public class ProjectMasterController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<ProjectMasterDTO> _validator;

        public ProjectMasterController(AppDbContext context, IValidator<ProjectMasterDTO> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public IActionResult GetAllProjectMasters()
        {
            try
            {
                var projects = _context.SPM_ProjectMasters
                    .Select(pm => new ProjectMasterDTO
                    {
                        ProjectID = pm.ProjectID,
                        ProjectTitle = pm.ProjectTitle,
                        Description = pm.Description
                    })
                    .ToList();

                return Ok(new ApiResponse<List<ProjectMasterDTO>>
                {
                    Success = true,
                    Message = "Project Masters retrieved successfully",
                    Data = projects
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving project masters.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("dropdown")]
        public IActionResult GetProjectsDropdown()
        {
            try
            {
                var projects = _context.SPM_ProjectMasters
                    .Select(p => new ProjectMasterDTO
                    {
                        ProjectID = p.ProjectID,
                        ProjectTitle = p.ProjectTitle
                    })
                    .ToList();

                return Ok(new ApiResponse<List<ProjectMasterDTO>>
                {
                    Success = true,
                    Message = "Projects retrieved successfully",
                    Data = projects
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
        public IActionResult GetProjectMasterById(int id)
        {
            try
            {
                var project = _context.SPM_ProjectMasters
                    .Where(pm => pm.ProjectID == id)
                    .Select(pm => new ProjectMasterDTO
                    {
                        ProjectID = pm.ProjectID,
                        ProjectTitle = pm.ProjectTitle,
                        Description = pm.Description
                    })
                    .FirstOrDefault();

                if (project == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Project Master not found",
                        Errors = new List<string> { "The project master with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<ProjectMasterDTO>
                {
                    Success = true,
                    Message = "Project Master retrieved successfully",
                    Data = project
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the project master.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddProjectMaster(ProjectMasterDTO projectMasterDto)
        {
            var result = await _validator.ValidateAsync(projectMasterDto);
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
                var projectMaster = new SPM_ProjectMaster
                {
                    ProjectTitle = projectMasterDto.ProjectTitle,
                    Description = projectMasterDto.Description
                };

                _context.SPM_ProjectMasters.Add(projectMaster);
                _context.SaveChanges();

                projectMasterDto.ProjectID = projectMaster.ProjectID;

                return Ok(new ApiResponse<ProjectMasterDTO>
                {
                    Success = true,
                    Message = "Project Master created successfully",
                    Data = projectMasterDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the project master.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectMaster(int id, ProjectMasterDTO projectMasterDto)
        {
            var result = await _validator.ValidateAsync(projectMasterDto);
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
                if (id != projectMasterDto.ProjectID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var projectMaster = new SPM_ProjectMaster
                {
                    ProjectID = projectMasterDto.ProjectID,
                    ProjectTitle = projectMasterDto.ProjectTitle,
                    Description = projectMasterDto.Description
                };

                _context.SPM_ProjectMasters.Update(projectMaster);
                _context.SaveChanges();

                return Ok(new ApiResponse<ProjectMasterDTO>
                {
                    Success = true,
                    Message = "Project Master updated successfully",
                    Data = projectMasterDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the project master.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProjectMaster(int id)
        {
            try
            {
                var project = _context.SPM_ProjectMasters.Find(id);

                if (project == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The project master with the provided ID does not exist." }
                    });
                }

                _context.SPM_ProjectMasters.Remove(project);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Project Master deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the project master.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}