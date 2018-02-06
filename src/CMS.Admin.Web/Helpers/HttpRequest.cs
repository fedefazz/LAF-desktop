using System.Collections.Generic;
using System.Net;

namespace blsp.Admin.Web.Helpers
{
    internal class HttpRequest
    {
        public IDictionary<string, string> Arguments;

        public string Url { get; set; }

        public HttpRequest()
        {
            Arguments = new Dictionary<string, string>();
        }

        public void AddArgument(string key, string value, bool encrypt = false)
        {
            Arguments.Add(key, value);
        }
    }
}