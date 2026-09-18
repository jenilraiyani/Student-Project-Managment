namespace studentProjectManagement.DTOs
{
    public class UserDTO
    {
        public int UserID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? UserCode { get; set; }
        public string Email { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string ProfilePicturePath { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int UserTypeId { get; set; }
        public bool IsActive { get; set; } = false;
        public bool IsDeleted { get; set; }
        public string? UserTypeName { get; set; }
    }
}