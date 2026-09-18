using FluentValidation;
using studentProjectManagement.DTOs;

namespace studentProjectManagement.Validators
{
    public class UserRoleValidator : AbstractValidator<UserRoleDTO>
    {
        public UserRoleValidator()
        {
            RuleFor(x => x.RoleID)
                .GreaterThan(0).WithMessage("Please select a valid Role");

            RuleFor(x => x.UserID)
                .GreaterThan(0).WithMessage("Please select a valid User");
        }
    }
}
