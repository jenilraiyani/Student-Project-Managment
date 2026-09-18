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
    public class UserRoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<UserRoleDTO> _validator;

        public UserRoleController(AppDbContext context, IValidator<UserRoleDTO> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public IActionResult GetAllUserRoles()
        {
            try
            {
                var userRoles = _context.SPM_UserRoles
                    .Include(ur => ur.User)
                    .Include(ur => ur.Role)
                    .Select(ur => new UserRoleDTO
                    {
                        RolePermissionID = ur.RolePermissionID,
                        RoleID = ur.RoleID,
                        RoleName = ur.Role.RoleName,
                        UserID = ur.UserID,
                        UserName = ur.User.FullName
                    })
                    .ToList();

                return Ok(new ApiResponse<List<UserRoleDTO>>
                {
                    Success = true,
                    Message = "User Roles retrieved successfully",
                    Data = userRoles
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving user roles.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetUserRoleById(int id)
        {
            try
            {
                var userRole = _context.SPM_UserRoles
                    .Include(ur => ur.User)
                    .Include(ur => ur.Role)
                    .Where(ur => ur.RolePermissionID == id)
                    .Select(ur => new UserRoleDTO
                    {
                        RolePermissionID = ur.RolePermissionID,
                        RoleID = ur.RoleID,
                        RoleName = ur.Role.RoleName,
                        UserID = ur.UserID,
                        UserName = ur.User.FullName
                    })
                    .FirstOrDefault();

                if (userRole == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User Role not found",
                        Errors = new List<string> { "The user role with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<UserRoleDTO>
                {
                    Success = true,
                    Message = "User Role retrieved successfully",
                    Data = userRole
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the user role.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddUserRole(UserRoleDTO userRoleDto)
        {
            var result = await _validator.ValidateAsync(userRoleDto);
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
                var userRole = new SPM_UserRole
                {
                    RoleID = userRoleDto.RoleID,
                    UserID = userRoleDto.UserID
                };

                _context.SPM_UserRoles.Add(userRole);
                _context.SaveChanges();

                userRoleDto.RolePermissionID = userRole.RolePermissionID;

                return Ok(new ApiResponse<UserRoleDTO>
                {
                    Success = true,
                    Message = "User Role created successfully",
                    Data = userRoleDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the user role.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserRole(int id, UserRoleDTO userRoleDto)
        {
            var result = await _validator.ValidateAsync(userRoleDto);
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
                if (id != userRoleDto.RolePermissionID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var userRole = new SPM_UserRole
                {
                    RolePermissionID = userRoleDto.RolePermissionID,
                    RoleID = userRoleDto.RoleID,
                    UserID = userRoleDto.UserID
                };

                _context.SPM_UserRoles.Update(userRole);
                _context.SaveChanges();

                return Ok(new ApiResponse<UserRoleDTO>
                {
                    Success = true,
                    Message = "User Role updated successfully",
                    Data = userRoleDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the user role.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUserRole(int id)
        {
            try
            {
                var userRole = _context.SPM_UserRoles.Find(id);

                if (userRole == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The user role with the provided ID does not exist." }
                    });
                }

                _context.SPM_UserRoles.Remove(userRole);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "User Role deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the user role.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}