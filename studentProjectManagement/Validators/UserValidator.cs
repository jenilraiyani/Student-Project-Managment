using FluentValidation;
using studentProjectManagement.DTOs;

namespace studentProjectManagement.Validators
{
    public class UserValidator : AbstractValidator<UserDTO>
    {
        public UserValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required")
                .MaximumLength(100).WithMessage("Full Name cannot exceed 100 characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Please enter a valid email address")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters");

            RuleFor(x => x.MobileNumber)
                .NotEmpty().WithMessage("Mobile Number is required")
                .Matches(@"^[0-9]{10}$").WithMessage("Mobile Number must be exactly 10 digits");

            RuleFor(x => x.UserTypeId)
                .GreaterThan(0).WithMessage("Please select a valid User Type");
                
            RuleFor(x => x.UserCode)
                .MaximumLength(50).WithMessage("User Code cannot exceed 50 characters");
        }
    }
}
