using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_ProjectMaster
    {
        [Key]
        public int ProjectID { get; set; }

        [Required, MaxLength(200)]
        public string ProjectTitle { get; set; } = string.Empty;

        public string? Description { get; set; }

        [JsonIgnore]
        public ICollection<SPM_ProjectAllocation> SPM_ProjectAllocations { get; set; } = new List<SPM_ProjectAllocation>();
    }
}
