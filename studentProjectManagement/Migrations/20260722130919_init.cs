using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace studentProjectManagement.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SPM_ProjectMasters",
                columns: table => new
                {
                    ProjectID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_ProjectMasters", x => x.ProjectID);
                });

            migrationBuilder.CreateTable(
                name: "SPM_Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_Roles", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "SPM_TaskPriorities",
                columns: table => new
                {
                    TaskPriorityID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaskPriorityName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TaskPriortyCssClass = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_TaskPriorities", x => x.TaskPriorityID);
                });

            migrationBuilder.CreateTable(
                name: "SPM_TaskStatuses",
                columns: table => new
                {
                    TaskStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaskStatusName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TaskStatusCssClass = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_TaskStatuses", x => x.TaskStatusID);
                });

            migrationBuilder.CreateTable(
                name: "SPM_UserTypes",
                columns: table => new
                {
                    UserTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserTypeName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_UserTypes", x => x.UserTypeID);
                });

            migrationBuilder.CreateTable(
                name: "SPM_Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MobileNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProfilePicturePath = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    UserTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_Users", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_SPM_Users_SPM_UserTypes_UserTypeId",
                        column: x => x.UserTypeId,
                        principalTable: "SPM_UserTypes",
                        principalColumn: "UserTypeID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SPM_ProjectAllocations",
                columns: table => new
                {
                    ProjectAllocationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssignedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProjectStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProjectEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalTasksGiven = table.Column<int>(type: "int", nullable: false),
                    TotalCompletedTasks = table.Column<int>(type: "int", nullable: false),
                    ProgressPercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OverAllGrade = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    FacultyID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_ProjectAllocations", x => x.ProjectAllocationID);
                    table.ForeignKey(
                        name: "FK_SPM_ProjectAllocations_SPM_ProjectMasters_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "SPM_ProjectMasters",
                        principalColumn: "ProjectID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SPM_ProjectAllocations_SPM_Users_FacultyID",
                        column: x => x.FacultyID,
                        principalTable: "SPM_Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SPM_ProjectAllocations_SPM_Users_StudentID",
                        column: x => x.StudentID,
                        principalTable: "SPM_Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SPM_UserRoles",
                columns: table => new
                {
                    RolePermissionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_UserRoles", x => x.RolePermissionID);
                    table.ForeignKey(
                        name: "FK_SPM_UserRoles_SPM_Roles_RoleID",
                        column: x => x.RoleID,
                        principalTable: "SPM_Roles",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SPM_UserRoles_SPM_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "SPM_Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SPM_Tasks",
                columns: table => new
                {
                    TaskID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaskTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TaskDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssignedScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EarnedScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProgressPercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaskAssignedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TaskStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TaskDueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TaskCompletedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NextFollowUpDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FacultyRemarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentRemarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectAllocationID = table.Column<int>(type: "int", nullable: false),
                    TaskStatusID = table.Column<int>(type: "int", nullable: false),
                    TaskPriorityID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_Tasks", x => x.TaskID);
                    table.ForeignKey(
                        name: "FK_SPM_Tasks_SPM_ProjectAllocations_ProjectAllocationID",
                        column: x => x.ProjectAllocationID,
                        principalTable: "SPM_ProjectAllocations",
                        principalColumn: "ProjectAllocationID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SPM_Tasks_SPM_TaskPriorities_TaskPriorityID",
                        column: x => x.TaskPriorityID,
                        principalTable: "SPM_TaskPriorities",
                        principalColumn: "TaskPriorityID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SPM_Tasks_SPM_TaskStatuses_TaskStatusID",
                        column: x => x.TaskStatusID,
                        principalTable: "SPM_TaskStatuses",
                        principalColumn: "TaskStatusID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SPM_ProjectAllocations_FacultyID",
                table: "SPM_ProjectAllocations",
                column: "FacultyID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_ProjectAllocations_ProjectID",
                table: "SPM_ProjectAllocations",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_ProjectAllocations_StudentID",
                table: "SPM_ProjectAllocations",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Roles_RoleName",
                table: "SPM_Roles",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Tasks_ProjectAllocationID",
                table: "SPM_Tasks",
                column: "ProjectAllocationID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Tasks_TaskPriorityID",
                table: "SPM_Tasks",
                column: "TaskPriorityID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Tasks_TaskStatusID",
                table: "SPM_Tasks",
                column: "TaskStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_UserRoles_RoleID",
                table: "SPM_UserRoles",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_UserRoles_UserID",
                table: "SPM_UserRoles",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Users_Email",
                table: "SPM_Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Users_UserTypeId",
                table: "SPM_Users",
                column: "UserTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SPM_Tasks");

            migrationBuilder.DropTable(
                name: "SPM_UserRoles");

            migrationBuilder.DropTable(
                name: "SPM_ProjectAllocations");

            migrationBuilder.DropTable(
                name: "SPM_TaskPriorities");

            migrationBuilder.DropTable(
                name: "SPM_TaskStatuses");

            migrationBuilder.DropTable(
                name: "SPM_Roles");

            migrationBuilder.DropTable(
                name: "SPM_ProjectMasters");

            migrationBuilder.DropTable(
                name: "SPM_Users");

            migrationBuilder.DropTable(
                name: "SPM_UserTypes");
        }
    }
}
