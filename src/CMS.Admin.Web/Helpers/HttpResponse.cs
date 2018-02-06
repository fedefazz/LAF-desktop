using System.Net;

namespace blsp.Admin.Web.Helpers
{
    internal class HttpResponse
    {
        public string Result { get; set; }

        public HttpStatusCode StatusCode { get; set; }

        public bool Success { get; set; }

        public HttpResponse() { }
    }
}