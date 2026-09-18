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
    public class UserTypeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<UserTypeDTO> _validator;

        public UserTypeController(AppDbContext context, IValidator<UserTypeDTO> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public IActionResult GetAllUserType()
        {
            try
            {
                var user_type = _context.SPM_UserTypes
                    .Select(ut => new UserTypeDTO
                    {
                        UserTypeID = ut.UserTypeID,
                        UserTypeName = ut.UserTypeName,
                        Description = ut.Description
                    })
                    .ToList();

                return Ok(new ApiResponse<List<UserTypeDTO>>
                {
                    Success = true,
                    Message = "User Types retrieved successfully",
                    Data = user_type
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving user types.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("dropdown")]
        public IActionResult GetUserTypesDropdown()
        {
            try
            {
                var userTypes = _context.SPM_UserTypes
                    .Select(u => new UserTypeDTO
                    {
                        UserTypeID = u.UserTypeID,
                        UserTypeName = u.UserTypeName
                    })
                    .ToList();

                return Ok(new ApiResponse<List<UserTypeDTO>>
                {
                    Success = true,
                    Message = "User Types retrieved successfully",
                    Data = userTypes
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
        public IActionResult GetUserTypeById(int id)
        {
            try
            {
                var user_type = _context.SPM_UserTypes
                    .Where(ut => ut.UserTypeID == id)
                    .Select(ut => new UserTypeDTO
                    {
                        UserTypeID = ut.UserTypeID,
                        UserTypeName = ut.UserTypeName,
                        Description = ut.Description
                    })
                    .FirstOrDefault();

                if (user_type == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User Type not found",
                        Errors = new List<string> { "The user type with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<UserTypeDTO>
                {
                    Success = true,
                    Message = "User Type retrieved successfully",
                    Data = user_type
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the user type.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddUserType(UserTypeDTO userTypeDto)
        {
            var result = await _validator.ValidateAsync(userTypeDto);
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
                var user_type = new SPM_UserType
                {
                    UserTypeName = userTypeDto.UserTypeName,
                    Description = userTypeDto.Description
                };

                _context.SPM_UserTypes.Add(user_type);
                _context.SaveChanges();

                userTypeDto.UserTypeID = user_type.UserTypeID;

                return Ok(new ApiResponse<UserTypeDTO>
                {
                    Success = true,
                    Message = "User Type created successfully",
                    Data = userTypeDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the user type.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserType(int id, UserTypeDTO userTypeDto)
        {
            var result = await _validator.ValidateAsync(userTypeDto);
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
                if (id != userTypeDto.UserTypeID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var user_type = new SPM_UserType
                {
                    UserTypeID = userTypeDto.UserTypeID,
                    UserTypeName = userTypeDto.UserTypeName,
                    Description = userTypeDto.Description
                };

                _context.SPM_UserTypes.Update(user_type);
                _context.SaveChanges();

                return Ok(new ApiResponse<UserTypeDTO>
                {
                    Success = true,
                    Message = "User Type updated successfully",
                    Data = userTypeDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the user type.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUserType(int id)
        {
            try
            {
                var user_type = _context.SPM_UserTypes.Find(id);

                if (user_type == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The user type with the provided ID does not exist." }
                    });
                }

                _context.SPM_UserTypes.Remove(user_type);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "User Type deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the user type.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}