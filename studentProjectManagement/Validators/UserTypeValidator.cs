using FluentValidation;
using studentProjectManagement.DTOs;

namespace studentProjectManagement.Validators
{
    public class UserTypeValidator : AbstractValidator<UserTypeDTO>
    {
        public UserTypeValidator()
        {
            RuleFor(x => x.UserTypeName)
                .NotEmpty().WithMessage("User Type Name is required")
                .MaximumLength(100).WithMessage("User Type Name cannot exceed 100 characters");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");
        }
    }
}
