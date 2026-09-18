using FluentValidation;
using studentProjectManagement.DTOs;

namespace studentProjectManagement.Validators
{
    public class TaskPriorityValidator : AbstractValidator<TaskPriorityDTO>
    {
        public TaskPriorityValidator()
        {
            RuleFor(x => x.TaskPriorityName)
                .NotEmpty().WithMessage("Task Priority Name is required")
                .MaximumLength(50).WithMessage("Task Priority Name cannot exceed 50 characters");

            RuleFor(x => x.TaskPriortyCssClass)
                .NotEmpty().WithMessage("CSS Class is required")
                .MaximumLength(50).WithMessage("CSS Class cannot exceed 50 characters");
        }
    }
}
