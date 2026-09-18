using Microsoft.EntityFrameworkCore;
using studentProjectManagement.Models;

namespace studentProjectManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            :base(options)
        {

        }

        public DbSet<SPM_User> SPM_Users => Set<SPM_User>();
        public DbSet<SPM_Role> SPM_Roles => Set<SPM_Role>();
        public DbSet<SPM_UserType> SPM_UserTypes => Set<SPM_UserType>();
        public DbSet<SPM_UserRole> SPM_UserRoles => Set<SPM_UserRole>();
        public DbSet<SPM_ProjectMaster> SPM_ProjectMasters => Set<SPM_ProjectMaster>();
        public DbSet<SPM_ProjectAllocation> SPM_ProjectAllocations => Set<SPM_ProjectAllocation>();
        public DbSet<SPM_Task> SPM_Tasks => Set<SPM_Task>();
        public DbSet<SPM_TaskStatus> SPM_TaskStatuses => Set<SPM_TaskStatus>();
        public DbSet<SPM_TaskPriority> SPM_TaskPriorities => Set<SPM_TaskPriority>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<SPM_User>()
                .HasOne(u => u.UserType)
                .WithMany(ut => ut.SPM_Users)
                .HasForeignKey(u => u.UserTypeId)
                .OnDelete(DeleteBehavior.Restrict);

           
            modelBuilder.Entity<SPM_UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.SPM_UserRoles)
                .HasForeignKey(ur => ur.RoleID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SPM_UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.SPM_UserRoles)
                .HasForeignKey(ur => ur.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SPM_ProjectAllocation>()
                .HasOne(pa => pa.ProjectMaster)
                .WithMany(pm => pm.SPM_ProjectAllocations)
                .HasForeignKey(pa => pa.ProjectID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SPM_ProjectAllocation>()
                .HasOne(pa => pa.Student)
                .WithMany(u => u.ProjectAllocationsAsStudent)
                .HasForeignKey(pa => pa.StudentID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SPM_ProjectAllocation>()
                .HasOne(pa => pa.Faculty)
                .WithMany(u => u.ProjectAllocationsAsFaculty)
                .HasForeignKey(pa => pa.FacultyID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SPM_Task>()
                .HasOne(t => t.TaskStatus)
                .WithMany(ts => ts.SPM_Tasks)
                .HasForeignKey(t => t.TaskStatusID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SPM_Task>()
                .HasOne(t => t.TaskPriority)
                .WithMany(tp => tp.SPM_Tasks)
                .HasForeignKey(t => t.TaskPriorityID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SPM_User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<SPM_Role>()
                .HasIndex(r => r.RoleName)
                .IsUnique();
        }

    }
}
