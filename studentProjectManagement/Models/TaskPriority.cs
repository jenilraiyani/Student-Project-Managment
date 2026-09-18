using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_TaskPriority
    {
        [Key]
        public int TaskPriorityID { get; set; }

        [Required, MaxLength(20)]
        public string TaskPriorityName { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string TaskPriortyCssClass { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<SPM_Task> SPM_Tasks { get; set; } = new List<SPM_Task>();
    }
}
