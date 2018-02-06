using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace blsp.Admin.Web.Models
{
    public class RssDto
    {
        public RssDto()
        {
            this.Items = new List<RssItemDto>();
        }

        [Required]
        public int Id { get; set; }

        public List<RssItemDto> Items { get; set; }
    }

    public class RssItemDto
    {
        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public string Content { get; set; }
    }
}