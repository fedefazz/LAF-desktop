using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace blsp.Admin.Web.Models
{
    public class LoginDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        public string ReturnUrl { get; set; }
    }
}