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
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<RoleDTO> _validator;

        public RoleController(AppDbContext context, IValidator<RoleDTO> validator)
        {
            _context = context;
            _validator = validator;
        }


        [HttpGet]
        public IActionResult GetAllRoles()
        {
            try
            {
                var roles = _context.SPM_Roles
                    .Select(r => new RoleDTO
                    {
                        RoleID = r.RoleID,
                        RoleName = r.RoleName,
                        Description = r.Description
                    })
                    .ToList();

                return Ok(new ApiResponse<List<RoleDTO>>
                {
                    Success = true,
                    Message = "Roles retrieved successfully",
                    Data = roles
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving roles.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }


        [HttpGet("dropdown")]
        public IActionResult GetRolesDropdown()
        {
            try
            {
                var roles = _context.SPM_Roles
                    .Select(r => new RoleDTO
                    {
                        RoleID = r.RoleID,
                        RoleName = r.RoleName
                    })
                    .ToList();

                return Ok(new ApiResponse<List<RoleDTO>>
                {
                    Success = true,
                    Message = "Roles retrieved successfully",
                    Data = roles
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving roles.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetRoleById(int id)
        {
            try
            {
                var role = _context.SPM_Roles
                    .Where(r => r.RoleID == id)
                    .Select(r => new RoleDTO
                    {
                        RoleID = r.RoleID,
                        RoleName = r.RoleName,
                        Description = r.Description
                    })
                    .FirstOrDefault();

                if (role == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Role not found",
                        Errors = new List<string> { "The role with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<RoleDTO>
                {
                    Success = true,
                    Message = "Role retrieved successfully",
                    Data = role
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the role.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }


        [HttpPost]
        public async Task<IActionResult> AddRole(RoleDTO roleDto)
        {
            var result = await _validator.ValidateAsync(roleDto);

            if (!result.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation Failed",
                    Data = null,
                    Errors = result.Errors
                    .Select(x => $"{x.PropertyName}: {x.ErrorMessage}")
                    .ToList()
                });
            }

            try
            {
                var role = new SPM_Role
                {
                    RoleName = roleDto.RoleName,
                    Description = roleDto.Description
                };

                _context.SPM_Roles.Add(role);
                _context.SaveChanges();

                roleDto.RoleID = role.RoleID;

                return Ok(new ApiResponse<RoleDTO>
                {
                    Success = true,
                    Message = "Role created successfully",
                    Data = roleDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the role.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }


        [HttpPut("{id}")]
        public IActionResult UpdateRole(int id, RoleDTO roleDto)
        {
            try
            {
                if (id != roleDto.RoleID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var role = new SPM_Role
                {
                    RoleID = roleDto.RoleID,
                    RoleName = roleDto.RoleName,
                    Description = roleDto.Description
                };

                _context.SPM_Roles.Update(role);
                _context.SaveChanges();

                return Ok(new ApiResponse<RoleDTO>
                {
                    Success = true,
                    Message = "Role updated successfully",
                    Data = roleDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the role.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteRole(int id)
        {
            try
            {
                var role = _context.SPM_Roles.Find(id);

                if (role == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The role with the provided ID does not exist." }
                    });
                }

                _context.SPM_Roles.Remove(role);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Role deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the role.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}