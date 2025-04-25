using System;
using System.ComponentModel.DataAnnotations;

namespace MedicalFileManagementSystem.Models
{
    public class MedicalFile
    {
        public int Id { get; set; }

        [Required]
        public string FileName { get; set; } = string.Empty; 

        public string FileType { get; set; } = string.Empty; 

        [Required]
        public string FileUrl { get; set; } = string.Empty; 

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }

        public User? User { get; set; } 
    }
}
