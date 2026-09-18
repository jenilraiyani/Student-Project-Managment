using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_UserType
    {
        [Key]
        public int UserTypeID { get; set; }

        [Required, MaxLength(50)]
        public string UserTypeName { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Description { get; set; }

        [JsonIgnore]
        public ICollection<SPM_User> SPM_Users { get; set; } = new List<SPM_User>();

    }
}
