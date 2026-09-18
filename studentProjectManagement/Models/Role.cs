using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_Role
    {
        [Key]
        public int RoleID { get; set; }
        [Required,MaxLength(50)]
        public string RoleName { get; set; }=string.Empty;
        [MaxLength(200)]
        public string? Description { get; set; }

        [JsonIgnore]
        public ICollection<SPM_UserRole> SPM_UserRoles { get; set; } = new List<SPM_UserRole>();
    }
}
