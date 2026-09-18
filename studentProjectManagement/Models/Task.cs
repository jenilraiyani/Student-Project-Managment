using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_Task
    {
        [Key]
        public int TaskID { get; set; }

        [Required, MaxLength(200)]
        public string TaskTitle { get; set; } = string.Empty;

        public string? TaskDescription { get; set; }

        [Required]
        public decimal AssignedScore { get; set; }

        public decimal EarnedScore { get; set; }

        [Required]
        public decimal ProgressPercentage { get; set; }

        [Required]
        public DateTime TaskAssignedDate { get; set; }

        public DateTime TaskStartDate { get; set; }

        public DateTime TaskDueDate { get; set; }

        public DateTime TaskCompletedDate { get; set; }
        public DateTime NextFollowUpDate { get; set; }

        public string? FacultyRemarks { get; set; }

        public string? StudentRemarks { get; set; }

        [ForeignKey("SPM_ProjectAllocation")]
        public int ProjectAllocationID { get; set; }

        [JsonIgnore]
        public SPM_ProjectAllocation? ProjectAllocation { get; set; }

        [ForeignKey("SPM_TaskStatus")]
        public int TaskStatusID { get; set; }

        [JsonIgnore]

        public SPM_TaskStatus? TaskStatus { get; set; }

        [ForeignKey("SPM_TaskPriority")]
        public int TaskPriorityID { get; set; }

        [JsonIgnore]
        public SPM_TaskPriority? TaskPriority { get; set; }

    }
}
