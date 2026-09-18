using FluentValidation;
using studentProjectManagement.DTOs;

namespace studentProjectManagement.Validators
{
    public class ProjectMasterValidator : AbstractValidator<ProjectMasterDTO>
    {
        public ProjectMasterValidator()
        {
            RuleFor(x => x.ProjectTitle)
                .NotEmpty().WithMessage("Project Title is required")
                .MaximumLength(200).WithMessage("Project Title cannot exceed 200 characters");

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");
        }
    }
}
