using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace blsp.Admin.Web.Models
{
    public class UserDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string Cellphone { get; set; }

        public string Country { get; set; }

        public string State { get; set; }

        public string City { get; set; }

        public string ZipCode { get; set; }

        [Required]
        public string LanguageId { get; set; }

        [Required]
        public string TimezoneId { get; set; }

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