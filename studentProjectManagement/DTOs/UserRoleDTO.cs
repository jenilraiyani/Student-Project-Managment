namespace studentProjectManagement.DTOs
{
    public class UserRoleDTO
    {
        public int RolePermissionID { get; set; }

        public int RoleID { get; set; }
        public string? RoleName { get; set; } 

        public int UserID { get; set; }
        public string? UserName { get; set; } 
    }
}