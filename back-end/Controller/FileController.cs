using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using MedicalFileManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public FileController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // POST /api/files/upload - Upload a new medical file
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] string fileName, [FromForm] string fileType, [FromForm] int userId, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileExtension = Path.GetExtension(file.FileName);
            var fileNameWithGuid = $"{Guid.NewGuid()}-{fileName}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileNameWithGuid);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var medicalFile = new MedicalFile
            {
                FileName = fileName,
                FileType = fileType,
                FileUrl = $"/uploads/{fileNameWithGuid}",
                UserId = userId,
                UploadedAt = DateTime.UtcNow
            };

            _context.MedicalFiles.Add(medicalFile);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                medicalFile.Id,
                medicalFile.FileName,
                medicalFile.FileType,
                medicalFile.FileUrl
            });
        }

        // GET /api/files/user/{id} - Get all files uploaded by a specific user
        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetFilesForUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("User not found.");

            var files = await _context.MedicalFiles
                .Where(f => f.UserId == id)
                .OrderBy(f => f.UploadedAt)
                .Select(f => new
                {
                    f.Id,
                    f.FileName,
                    f.FileType,
                    f.FileUrl,
                    f.UploadedAt
                })
                .ToListAsync();

            if (files.Count == 0)
                return NoContent(); // No files found for this user

            return Ok(files);
        }

        // DELETE /api/files/{id} - Delete a specific uploaded file
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            var file = await _context.MedicalFiles.FindAsync(id);
            if (file == null)
                return NotFound("File not found.");

            // Delete the file from the server
            var filePath = Path.Combine(_env.WebRootPath ?? "wwwroot", file.FileUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            // Delete the record from the database
            _context.MedicalFiles.Remove(file);
            await _context.SaveChangesAsync();

            return Ok(new { message = "File deleted successfully" });
        }
    }
}
