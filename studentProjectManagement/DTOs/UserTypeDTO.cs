namespace studentProjectManagement.DTOs
{
    public class UserTypeDTO
    {
        public int UserTypeID { get; set; }
        public string UserTypeName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}