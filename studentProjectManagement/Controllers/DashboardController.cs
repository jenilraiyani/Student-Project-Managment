using Microsoft.AspNetCore.Authorization;
﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentProjectManagement.Common;
using studentProjectManagement.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace studentProjectManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDashboardData()
        {
            try
            {
                var totalStudents = await _context.SPM_Users
                    .CountAsync(x => x.UserType.UserTypeName == "Student");

            var totalFaculty = await _context.SPM_Users
                .CountAsync(x => x.UserType.UserTypeName == "Faculty");

            var totalProjects = await _context.SPM_ProjectMasters.CountAsync();

            var taskStatusSummary = await _context.SPM_Tasks
                .GroupBy(t => t.TaskStatus.TaskStatusName)
                .Select(g => new
                {
                    TaskStatus = g.Key,
                    TotalTasks = g.Count()
                })
                .ToListAsync();

            var prioritySummary = await _context.SPM_Tasks
                .GroupBy(t => t.TaskPriority.TaskPriorityName)
                .Select(g => new
                {
                    Priority = g.Key,
                    TotalTasks = g.Count()
                })
                .ToListAsync();

            var facultyWorkload = await _context.SPM_ProjectAllocations
                .GroupBy(p => p.Faculty.FullName)
                .Select(g => new
                {
                    FacultyName = g.Key,
                    TotalProjects = g.Count()
                })
                .OrderByDescending(x => x.TotalProjects)
                .ToListAsync();

            var studentTasks = await _context.SPM_Tasks
                .GroupBy(t => t.ProjectAllocation.Student.FullName)
                .Select(g => new
                {
                    StudentName = g.Key,
                    TotalTasks = g.Count()
                })
                .OrderByDescending(x => x.TotalTasks)
                .ToListAsync();

            var topStudents = await _context.SPM_Tasks
                .Where(t => t.EarnedScore > 0)
                .GroupBy(t => t.ProjectAllocation.Student.FullName)
                .Select(g => new
                {
                    StudentName = g.Key,
                    AverageScore = g.Average(t => t.EarnedScore)
                })
                .OrderByDescending(x => x.AverageScore)
                .Take(10)
                .ToListAsync();

            var bottomStudents = await _context.SPM_Tasks
                .Where(t => t.EarnedScore > 0)
                .GroupBy(t => t.ProjectAllocation.Student.FullName)
                .Select(g => new
                {
                    StudentName = g.Key,
                    AverageScore = g.Average(t => t.EarnedScore)
                })
                .OrderBy(x => x.AverageScore)
                .Take(10)
                .ToListAsync();

            var overdueTasks = await _context.SPM_Tasks
                .Where(t =>
                    t.TaskDueDate < DateTime.Now &&
                    t.TaskStatus.TaskStatusName != "Completed")
                .Select(t => new
                {
                    t.TaskTitle,
                    Student = t.ProjectAllocation.Student.FullName,
                    Faculty = t.ProjectAllocation.Faculty.FullName,
                    t.TaskDueDate
                })
                .ToListAsync();

            var upcomingFollowUps = await _context.SPM_Tasks
                .Where(t =>
                    t.NextFollowUpDate >= DateTime.Today &&
                    t.NextFollowUpDate <= DateTime.Today.AddDays(7))
                .Select(t => new
                {
                    t.TaskTitle,
                    t.NextFollowUpDate
                })
                .ToListAsync();

            var gradeDistribution = await _context.SPM_ProjectAllocations
                .GroupBy(p => p.OverAllGrade)
                .Select(g => new
                {
                    Grade = g.Key,
                    Students = g.Count()
                })
                .OrderBy(x => x.Grade)
                .ToListAsync();

            var monthlyCompletion = await _context.SPM_Tasks
                .Where(t => t.TaskCompletedDate != default)
                .GroupBy(t => new
                {
                    Year = t.TaskCompletedDate.Year,
                    Month = t.TaskCompletedDate.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    TotalCompletedTasks = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            var activeUsersByRole = await _context.SPM_UserRoles
                .Where(x => x.User.IsActive)
                .GroupBy(x => x.Role.RoleName)
                .Select(g => new
                {
                    RoleName = g.Key,
                    ActiveUsers = g.Count()
                })
                .OrderByDescending(x => x.ActiveUsers)
                .ToListAsync();

            var usersByRole = await _context.SPM_UserRoles
                .GroupBy(x => x.Role.RoleName)
                .Select(g => new
                {
                    RoleName = g.Key,
                    Users = g.Select(x => x.User.FullName).ToList()
                })
                .ToListAsync();

            var largeRoles = await _context.SPM_UserRoles
                .GroupBy(x => x.Role.RoleName)
                .Select(g => new
                {
                    RoleName = g.Key,
                    TotalUsers = g.Count()
                })
                .Where(x => x.TotalUsers > 10)
                .ToListAsync();

            var roleStats = await _context.SPM_UserRoles
                .GroupBy(x => x.Role.RoleName)
                .Select(g => new
                {
                    RoleName = g.Key,
                    TotalUsers = g.Count(),
                    ActiveUsers = g.Count(x => x.User.IsActive),
                    InactiveUsers = g.Count(x => !x.User.IsActive)
                })
                .OrderByDescending(x => x.TotalUsers)
                .ToListAsync();

            var upcomingTasks = await _context.SPM_Tasks
                .Where(x =>
                    x.TaskDueDate >= DateTime.Today &&
                    x.TaskDueDate <= DateTime.Today.AddDays(7))
                .Select(x => new
                {
                    x.TaskTitle,
                    x.TaskDueDate,
                    Student = x.ProjectAllocation.Student.FullName,
                    RemainingDays = EF.Functions.DateDiffDay(DateTime.Today, x.TaskDueDate)
                })
                .OrderBy(x => x.TaskDueDate)
                .ToListAsync();

            var projectProgress = await _context.SPM_Tasks
                .GroupBy(x => x.ProjectAllocation.ProjectMaster.ProjectTitle) 
                .Select(g => new
                {
                    Project = g.Key,
                    TotalTasks = g.Count(),
                    CompletedTasks = g.Count(x => x.TaskStatus.TaskStatusName == "Completed"),
                    PendingTasks = g.Count(x => x.TaskStatus.TaskStatusName == "Pending"),
                    AverageProgress = g.Average(x => x.ProgressPercentage)
                })
                .ToListAsync();

            var topProjects = await _context.SPM_Tasks 
                .Where(x => x.EarnedScore > 0)
                .GroupBy(x => x.ProjectAllocation.ProjectMaster.ProjectTitle) 
                .Select(g => new
                {
                    Project = g.Key,
                    AverageScore = g.Average(x => x.EarnedScore)
                })
                .OrderByDescending(x => x.AverageScore)
                .Take(10)
                .ToListAsync();

            var facultyStats = await _context.SPM_ProjectAllocations
                .GroupBy(x => x.Faculty.FullName)
                .Select(g => new
                {
                    Faculty = g.Key,
                    TotalProjects = g.Count(),
                    TotalTasks = g.Sum(x => x.TotalTasksGiven),
                    AverageProgress = g.Average(x => x.ProgressPercentage)
                })
                .ToListAsync();

            var studentStats = await _context.SPM_Tasks
                .GroupBy(x => x.ProjectAllocation.Student.FullName)
                .Select(g => new
                {
                    Student = g.Key,
                    TotalTasks = g.Count(),
                    CompletedTasks = g.Count(x => x.TaskStatus.TaskStatusName == "Completed"),
                    PendingTasks = g.Count(x => x.TaskStatus.TaskStatusName == "Pending"),
                    AverageScore = g.Average(x => x.EarnedScore)
                })
                .ToListAsync();

            var overdueProjects = await _context.SPM_ProjectAllocations 
                .Where(x =>
                    x.ProjectEndDate < DateTime.Now &&
                    x.ProgressPercentage < 100)
                .Select(x => new
                {
                    x.ProjectMaster.ProjectTitle, 
                    Student = x.Student.FullName,
                    x.ProjectEndDate,
                    x.ProgressPercentage
                })
                .ToListAsync();

            var facultyAvgProgress = await _context.SPM_ProjectAllocations 
                .GroupBy(x => x.Faculty.FullName)
                .Select(g => new
                {
                    Faculty = g.Key,
                    AverageProgress = g.Average(x => x.ProgressPercentage)
                })
                .OrderByDescending(x => x.AverageProgress)
                .ToListAsync();

            var projectTaskBreakdown = await _context.SPM_Tasks 
                .GroupBy(x => x.ProjectAllocation.ProjectMaster.ProjectTitle) 
                .Select(g => new
                {
                    Project = g.Key,
                    TotalTasks = g.Count(),
                    CompletedTasks = g.Count(x => x.TaskStatus.TaskStatusName == "Completed"),
                    PendingTasks = g.Count(x => x.TaskStatus.TaskStatusName == "Pending"),
                    OverdueTasks = g.Count(x =>
                        x.TaskDueDate < DateTime.Now &&
                        x.TaskStatus.TaskStatusName != "Completed")
                })
                .ToListAsync();

            
            var responseData = new
            {
                TotalStudents = totalStudents,
                TotalFaculty = totalFaculty,
                TotalProjects = totalProjects,
                TaskStatusSummary = taskStatusSummary,
                PrioritySummary = prioritySummary,
                FacultyWorkload = facultyWorkload,
                StudentTasks = studentTasks,
                TopStudents = topStudents,
                BottomStudents = bottomStudents,
                OverdueTasks = overdueTasks,
                UpcomingFollowUps = upcomingFollowUps,
                GradeDistribution = gradeDistribution,
                MonthlyCompletion = monthlyCompletion,
                ActiveUsersByRole = activeUsersByRole,
                UsersByRole = usersByRole,
                LargeRoles = largeRoles,
                RoleStats = roleStats,
                UpcomingTasks = upcomingTasks,
                ProjectProgress = projectProgress,
                TopProjects = topProjects,
                FacultyStats = facultyStats,
                StudentStats = studentStats,
                OverdueProjects = overdueProjects,
                FacultyAvgProgress = facultyAvgProgress,
                ProjectTaskBreakdown = projectTaskBreakdown
            };

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Dashboard data retrieved successfully",
                Data = responseData
            });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred while retrieving dashboard data.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}