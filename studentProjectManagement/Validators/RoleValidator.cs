using FluentValidation;
using studentProjectManagement.DTOs;

namespace studentProjectManagement.Validators
{
    public class RoleValidator : AbstractValidator<RoleDTO>
    {
        public RoleValidator()
        {
            RuleFor(x => x.RoleName)
                .NotEmpty()
                .WithMessage("Role Name is required")
                .Must(name => !string.IsNullOrWhiteSpace(name))
                .WithMessage("Role Name cannot be empty or whitespace")
                .MaximumLength(100)
                .WithMessage("Role Name cannot exceed 100 characters");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Description cannot exceed 500 characters");
        }
    }
}
