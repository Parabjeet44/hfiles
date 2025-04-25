using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MedicalFileManagementSystem.Models
{
    public class User
    {
        public int id { get; set; }

        [EmailAddress]
        public string email { get; set; } = string.Empty;

        [Phone]
        public string phoneNumber { get; set; } = string.Empty;

        public string gender { get; set; } = string.Empty;

        public string profileImageUrl { get; set; } = string.Empty;

        public List<MedicalFile> medicalfiles { get; set; } = new();
    }
}
