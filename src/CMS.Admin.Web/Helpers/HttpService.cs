using System;
using System.Net.Http;
using System.Text;

namespace blsp.Admin.Web.Helpers
{
    internal static class HttpService
    {
        public static HttpResponse Get(HttpRequest request)
        {
            return InternalGet(request);
        }

        public static HttpResponse Post(HttpRequest request)
        {
            return InternalPost(request);
        }

        private static HttpResponse InternalGet(HttpRequest request)
        {
            var ret = new HttpResponse();

            using (var client = new HttpClient())
            {
                try
                {
                    if (request.Arguments != null)
                    {
                        var sb = new StringBuilder();

                        foreach (var argument in request.Arguments)
                        {
                            if (sb.Length == 0)
                                sb.Append(string.Format("?{0}={1}", argument.Key, argument.Value));
                            else
                                sb.Append(string.Format("&{0}={1}", argument.Key, argument.Value));
                        }

                        request.Url = request.Url + sb;
                    }

                    HttpResponseMessage response = client.GetAsync(request.Url).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        ret.Success = true;
                        ret.Result = response.Content.ReadAsStringAsync().Result;
                        ret.StatusCode = response.StatusCode;
                    }
                    else
                    {
                        if (response != null && response.Content != null && !string.IsNullOrWhiteSpace(response.Content.ReadAsStringAsync().Result))
                        {
                            ret.Success = false;
                            ret.Result = response.Content.ReadAsStringAsync().Result;
                            ret.StatusCode = response.StatusCode;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ret.Success = false;
                    ret.Result = ex.Message;
                }

                return ret;
            }
        }

        private static HttpResponse InternalPost(HttpRequest request)
        {
            var ret = new HttpResponse();

            using (var client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = client.PostAsync(request.Url, new FormUrlEncodedContent(request.Arguments)).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        ret.Success = true;
                        ret.Result = response.Content.ReadAsStringAsync().Result;
                        ret.StatusCode = response.StatusCode;
                    }
                    else
                    {
                        if (response != null && response.Content != null && !string.IsNullOrWhiteSpace(response.Content.ReadAsStringAsync().Result))
                        {
                            ret.Success = false;
                            ret.Result = response.Content.ReadAsStringAsync().Result;
                            ret.StatusCode = response.StatusCode;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ret.Success = false;
                    ret.Result = ex.Message;
                }

                return ret;
            }
        }
    }
}