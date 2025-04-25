using Microsoft.EntityFrameworkCore;
using MedicalFileManagementSystem.Models;
using MySqlServerVersion = Microsoft.EntityFrameworkCore.ServerVersion;
namespace Backend.Data{
    public class AppDbContext : DbContext{
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
        public DbSet<User> Users { get; set; }
        public DbSet<MedicalFile> MedicalFiles { get; set; }
    }
}