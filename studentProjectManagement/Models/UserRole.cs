using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_UserRole
    {
        [Key]
        public int RolePermissionID { get; set; }

        [ForeignKey("SPM_Role")]
        public int RoleID { get; set; }

        public SPM_Role? Role { get; set; }

        [ForeignKey("SPM_User")]
        public int UserID { get; set; }

        [JsonIgnore]
        public SPM_User? User { get; set; }

    }
}
