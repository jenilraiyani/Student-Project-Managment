using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_TaskStatus
    {
        [Key]
        public int TaskStatusID { get; set; }

        [Required,MaxLength(20)]
        public string TaskStatusName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string TaskStatusCssClass { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<SPM_Task> SPM_Tasks { get; set; } = new List<SPM_Task>();

    }
}
