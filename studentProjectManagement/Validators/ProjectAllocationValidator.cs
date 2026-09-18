using FluentValidation;
using studentProjectManagement.DTOs;

namespace studentProjectManagement.Validators
{
    public class ProjectAllocationValidator : AbstractValidator<ProjectAllocationDTO>
    {
        public ProjectAllocationValidator()
        {
            RuleFor(x => x.ProjectID)
                .GreaterThan(0).WithMessage("Please select a valid Project");

            RuleFor(x => x.StudentID)
                .GreaterThan(0).WithMessage("Please select a valid Student");

            RuleFor(x => x.FacultyID)
                .GreaterThan(0).WithMessage("Please select a valid Faculty");

            RuleFor(x => x.TotalTasksGiven)
                .GreaterThanOrEqualTo(0).WithMessage("Total tasks cannot be negative");

            RuleFor(x => x.TotalCompletedTasks)
                .GreaterThanOrEqualTo(0).WithMessage("Completed tasks cannot be negative")
                .LessThanOrEqualTo(x => x.TotalTasksGiven).WithMessage("Completed tasks cannot exceed total tasks");

            RuleFor(x => x.ProgressPercentage)
                .InclusiveBetween(0, 100).WithMessage("Progress must be between 0 and 100");

            RuleFor(x => x.OverAllGrade)
                .MaximumLength(10).WithMessage("Overall Grade cannot exceed 10 characters");
        }
    }
}
