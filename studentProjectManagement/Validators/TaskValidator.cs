using FluentValidation;
using studentProjectManagement.DTOs;

namespace studentProjectManagement.Validators
{
    public class TaskValidator : AbstractValidator<TaskDTO>
    {
        public TaskValidator()
        {
            RuleFor(x => x.TaskTitle)
                .NotEmpty().WithMessage("Task Title is required")
                .MaximumLength(200).WithMessage("Task Title cannot exceed 200 characters");

            RuleFor(x => x.TaskDescription)
                .MaximumLength(1000).WithMessage("Task Description cannot exceed 1000 characters");

            RuleFor(x => x.ProjectAllocationID)
                .GreaterThan(0).WithMessage("Please select a valid Project Allocation");

            RuleFor(x => x.TaskStatusID)
                .GreaterThan(0).WithMessage("Please select a valid Task Status");

            RuleFor(x => x.TaskPriorityID)
                .GreaterThan(0).WithMessage("Please select a valid Task Priority");

            RuleFor(x => x.AssignedScore)
                .GreaterThanOrEqualTo(0).WithMessage("Assigned score cannot be negative");

            RuleFor(x => x.EarnedScore)
                .GreaterThanOrEqualTo(0).WithMessage("Earned score cannot be negative")
                .LessThanOrEqualTo(x => x.AssignedScore).WithMessage("Earned score cannot exceed assigned score");

            RuleFor(x => x.ProgressPercentage)
                .InclusiveBetween(0, 100).WithMessage("Progress must be between 0 and 100");

            RuleFor(x => x.FacultyRemarks)
                .MaximumLength(1000).WithMessage("Faculty remarks cannot exceed 1000 characters");
                
            RuleFor(x => x.StudentRemarks)
                .MaximumLength(1000).WithMessage("Student remarks cannot exceed 1000 characters");
        }
    }
}
