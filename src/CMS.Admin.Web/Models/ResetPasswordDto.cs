using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace blsp.Admin.Web.Models
{
    public class ResetPasswordDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [MinLength(8, ErrorMessage = "Your password must be at least 8 characters")]
        //[RegularExpression(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{4,}$", ErrorMessage = "Your password must not contain any special characters, symbols or spaces")]

        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Fields \"Password\" and \"Confirm Password\" must be equal")]
        public string ConfirmPassword { get; set; }
    }
}