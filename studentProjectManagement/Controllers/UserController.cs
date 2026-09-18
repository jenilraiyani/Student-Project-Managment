using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentProjectManagement.Common;
using studentProjectManagement.Data;
using studentProjectManagement.DTOs;
using studentProjectManagement.Models;
using studentProjectManagement.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace studentProjectManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly AppDbContext _context;
        private readonly IValidator<UserDTO> _validator;

        public UserController(AppDbContext context, IValidator<UserDTO> validator, TokenService tokenService)
        {
            _context = context;
            _validator = validator;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            try
            {
                var user = await _context.SPM_Users
                                               .Include(u => u.UserType)
                                               .SingleOrDefaultAsync(u =>
                                               u.Email == dto.Email &&
                                               u.Password == dto.Password);
                if (user == null)
                {
                    return Unauthorized("Invalid Email or password");
                }
                var token = _tokenService.GenerateToken(user);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Something went wrong: " + ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _context.SPM_Users
                    .Include(u => u.UserType)
                    .Select(u => new UserDTO
                    {
                        UserID = u.UserID,
                        FullName = u.FullName,
                        UserCode = u.UserCode,
                        Email = u.Email,
                        MobileNumber = u.MobileNumber,
                        ProfilePicturePath = u.ProfilePicturePath,
                        Password = u.Password,
                        UserTypeId = u.UserTypeId,
                        IsActive = u.IsActive,
                        IsDeleted = u.IsDeleted,
                        UserTypeName = u.UserType.UserTypeName
                    })
                    .ToList();

                return Ok(new ApiResponse<List<UserDTO>>
                {
                    Success = true,
                    Message = "Users retrieved successfully",
                    Data = users
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving users.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }


        [HttpGet("dropdown")]
        public IActionResult GetUsersDropdown()
        {
            try
            {
                var users = _context.SPM_Users
                    .Include(u => u.UserType)
                    .Select(u => new UserDTO
                    {
                        UserID = u.UserID,
                        FullName = u.FullName
                    })
                    .ToList();

                return Ok(new ApiResponse<List<UserDTO>>
                {
                    Success = true,
                    Message = "Users retrieved successfully",
                    Data = users
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving users.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }



        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                var user = _context.SPM_Users
                    .Include(u => u.UserType)
                    .Where(u => u.UserID == id)
                    .Select(u => new UserDTO
                    {
                        UserID = u.UserID,
                        FullName = u.FullName,
                        UserCode = u.UserCode,
                        Email = u.Email,
                        MobileNumber = u.MobileNumber,
                        ProfilePicturePath = u.ProfilePicturePath,
                        Password = u.Password,
                        UserTypeId = u.UserTypeId,
                        IsActive = u.IsActive,
                        IsDeleted = u.IsDeleted,
                        UserTypeName = u.UserType.UserTypeName
                    })
                    .FirstOrDefault();

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found",
                        Errors = new List<string> { "The user with the provided ID does not exist." }
                    });
                }

                return Ok(new ApiResponse<UserDTO>
                {
                    Success = true,
                    Message = "User retrieved successfully",
                    Data = user
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving the user.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddUser(UserDTO userDto)
        {
            var result = await _validator.ValidateAsync(userDto);
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
                var user = new SPM_User
                {
                    FullName = userDto.FullName,
                    UserCode = userDto.UserCode,
                    Email = userDto.Email,
                    MobileNumber = userDto.MobileNumber,
                    ProfilePicturePath = userDto.ProfilePicturePath,
                    Password = userDto.Password,
                    UserTypeId = userDto.UserTypeId,
                    IsActive = userDto.IsActive,
                    IsDeleted = userDto.IsDeleted
                };

                _context.SPM_Users.Add(user);
                _context.SaveChanges();

                userDto.UserID = user.UserID;

                return Ok(new ApiResponse<UserDTO>
                {
                    Success = true,
                    Message = "User created successfully",
                    Data = userDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while creating the user.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDTO userDto)
        {
            var result = await _validator.ValidateAsync(userDto);
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
                if (id != userDto.UserID)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Update failed",
                        Errors = new List<string> { "ID mismatch between route and payload." }
                    });
                }

                var user = new SPM_User
                {
                    UserID = userDto.UserID,
                    FullName = userDto.FullName,
                    UserCode = userDto.UserCode,
                    Email = userDto.Email,
                    MobileNumber = userDto.MobileNumber,
                    ProfilePicturePath = userDto.ProfilePicturePath,
                    Password = userDto.Password,
                    UserTypeId = userDto.UserTypeId,
                    IsActive = userDto.IsActive,
                    IsDeleted = userDto.IsDeleted
                };

                _context.SPM_Users.Update(user);
                _context.SaveChanges();

                return Ok(new ApiResponse<UserDTO>
                {
                    Success = true,
                    Message = "User updated successfully",
                    Data = userDto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while updating the user.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                var user = _context.SPM_Users.Find(id);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Delete failed",
                        Errors = new List<string> { "The user with the provided ID does not exist." }
                    });
                }

                _context.SPM_Users.Remove(user);
                _context.SaveChanges();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "User deleted successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while deleting the user.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}