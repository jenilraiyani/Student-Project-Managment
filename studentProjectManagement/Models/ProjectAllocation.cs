using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace studentProjectManagement.Models
{
    public class SPM_ProjectAllocation
    {
        [Key]
        public int ProjectAllocationID { get; set; }

        [Required]
        public DateTime AssignedDate { get; set; }= DateTime.Now;

        [Required]
        public DateTime ProjectStartDate { get; set; }

        [Required]
        public DateTime ProjectEndDate { get; set; }

        [Required]
        public int TotalTasksGiven { get; set; }

        [Required]
        public int TotalCompletedTasks { get; set; }

        [Required]
        public decimal ProgressPercentage { get; set; }

        [MaxLength(1)]
        public string? OverAllGrade { get; set; }

        [ForeignKey("SPM_ProjectMaster")]
        public int ProjectID { get; set; }

        [JsonIgnore]
        public SPM_ProjectMaster? ProjectMaster { get; set; }

        [ForeignKey("SPM_User")]
        public int StudentID { get; set; }

        [JsonIgnore]

        public SPM_User? Student { get; set; }


        [ForeignKey("SPM_User")]
        public int FacultyID { get; set; }

        [JsonIgnore]

        public SPM_User? Faculty { get; set; }

    }
}
