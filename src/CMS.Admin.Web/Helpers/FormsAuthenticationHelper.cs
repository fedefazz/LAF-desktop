using System;
using System.Web;
using System.Web.Security;

namespace blsp.Admin.Web.Helpers
{
    public class FormsAuthenticationHelper
    {
        internal static void SaveAuthCookie(string userName, bool rememberMe)
        {
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, userName, DateTime.Now,
                DateTime.Now.AddMinutes((int)FormsAuthentication.Timeout.TotalMinutes), rememberMe, string.Empty);
            var eticket = FormsAuthentication.Encrypt(ticket);
            System.Web.HttpCookie cookie = new System.Web.HttpCookie(FormsAuthentication.FormsCookieName, eticket);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }

        internal static void SignOut()
        {
            FormsAuthentication.SignOut();
        }
    }
}