using System.Web.Mvc;
using System.ServiceModel.Syndication;
using System.Xml;
using System.Xml.Linq;
using System.Net;
using blsp.Admin.Web.Models;

namespace blsp.Admin.Web.Controllers
{
    [Authorize]
    public class ServiceController : Controller
    {
        public JsonResult RssReader()
        {
            string url = "https://information-syndication.api.bbc.com/articles?api_key=zjV7xbmtOY4GpaGpXHmXzJACW6ejAiLZ&index=mundo-front-page&mixin=body&mixin=summary&mixin=body_images&mixin=thumbnail_images&mixin=hero_images&accept_override=rss2";
            
            RssDto rr = new RssDto();

            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Accept = "application/rss+xml";
            using (var response = request.GetResponse())
            using (var responseStream = response.GetResponseStream())
            using (var reader = XmlReader.Create(responseStream)) {
                SyndicationFeed feed = SyndicationFeed.Load(reader);
                reader.Close();

                foreach (SyndicationItem item in feed.Items)
                {
                    RssItemDto ritem = new RssItemDto();

                    ritem.Title = item.Title.Text;
                    ritem.Description = item.Summary.Text;

                    ritem.Content = item.ElementExtensions[0].GetObject<XElement>().Value;

                    rr.Items.Add(ritem);
                }
            }

            return new JsonResult() { Data = rr, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}