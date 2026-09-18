namespace studentProjectManagement.DTOs
{
    public class ProjectMasterDTO
    {
        public int ProjectID { get; set; }
        public string ProjectTitle { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}