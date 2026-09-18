using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_User
    {
        [Key]
        public int UserID { get; set; }

        [Required, MaxLength(50)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? UserCode { get; set; }

        [Required, MaxLength(50)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string Password { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string MobileNumber { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string ProfilePicturePath { get; set; } = string.Empty;

        [Required]
        public bool IsActive { get; set; } = false;

        public bool IsDeleted { get; set; }

        [ForeignKey("SPM_UserType")]
        public int UserTypeId { get; set; }

        [JsonIgnore]
        public SPM_UserType? UserType { get; set; }

        [JsonIgnore]
        public ICollection<SPM_UserRole> SPM_UserRoles { get; set; } = new List<SPM_UserRole>();

        [JsonIgnore]
        public ICollection<SPM_ProjectAllocation> ProjectAllocationsAsStudent { get; set; } = new List<SPM_ProjectAllocation>();

        [JsonIgnore]
        public ICollection<SPM_ProjectAllocation> ProjectAllocationsAsFaculty { get; set; } = new List<SPM_ProjectAllocation>();
    }
}
