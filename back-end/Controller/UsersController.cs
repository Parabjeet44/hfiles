using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using MedicalFileManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public UserController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // Get user profile
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProfile(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.id,
                user.email,
                user.gender,
                phoneNumber = user.phoneNumber,
                profileImageUrl = user.profileImageUrl
            });
        }

        // Update user profile
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] User updated)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.email = updated.email;
            user.gender = updated.gender;
            user.phoneNumber = updated.phoneNumber;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Upload profile image
        [HttpPost("{id}/image")]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"user{id}-{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.profileImageUrl = $"/uploads/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new { profileImageUrl = user.profileImageUrl });
        }

        // Create a new user
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User newUser)
        {
            // Ensure that the email and phone number are provided
            if (string.IsNullOrEmpty(newUser.email) || string.IsNullOrEmpty(newUser.phoneNumber))
            {
                return BadRequest("Email and phone number are required.");
            }

            // Add the new user to the database
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // Return the created user, including their ID and other details
            return CreatedAtAction(nameof(GetProfile), new { id = newUser.id }, newUser);
        }
    }
}
