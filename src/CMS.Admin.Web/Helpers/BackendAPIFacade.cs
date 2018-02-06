using blsp.Admin.Web.Models;
using System.Net.Http;
using System.Web;

namespace blsp.Admin.Web.Helpers
{
    internal class BackendAPIFacade
    {
        public static string GetToken(string userName, string password)
        {
            var request = new HttpRequest()
              {
                  Url = AppSettingsHelper.GetValue<string>("blsp.BackendAPI.Token.Url", () => string.Empty)
              };

            request.AddArgument("username", userName);
            request.AddArgument("password", password);
            request.AddArgument("grant_type", "password");

            var response = HttpService.Post(request);

            if (response.Success)
                return response.Result;
            else
                return string.Empty;
        }

        public static void ForgotPassword(string userName)
        {
            var request = new HttpRequest()
            {
                Url = string.Format("{0}{1}", AppSettingsHelper.GetValue<string>("blsp.BackendAPI.Base.Url", () => string.Empty), "Account/ForgotPassword")
            };

            request.AddArgument("email", userName);

            var response = HttpService.Post(request);
        }

        public static string ResetPassword(ResetPasswordDto dto)
        {
            var request = new HttpRequest()
            {
                Url = string.Format("{0}{1}", AppSettingsHelper.GetValue<string>("blsp.BackendAPI.Base.Url", () => string.Empty), "Account/ResetPassword")
            };

            request.AddArgument("email", dto.Email);
            request.AddArgument("token", dto.Token);
            request.AddArgument("password", dto.Password);
            request.AddArgument("confirmpassword", dto.ConfirmPassword);

            var response = HttpService.Post(request);

            if (response.Success)
            {
                return "ok";
            }

            return string.Empty;
        }

        public static string GetUserRequest(int userId, string token)
        {
            var request = new HttpRequest()
            {
                Url = string.Format("{0}{1}", AppSettingsHelper.GetValue<string>("blsp.BackendAPI.Base.Url", () => string.Empty), "Account/GetUserRequest")
            };

            request.AddArgument("userid", userId.ToString());
            request.AddArgument("token", HttpUtility.UrlEncode(token));

            var response = HttpService.Get(request);

            if (response.Success)
                return response.Result;
            else
                return string.Empty;
        }

        public static string ConfirmUserRequest(UserDto userDto)
        {
            var request = new HttpRequest()
            {
                Url = string.Format("{0}{1}", AppSettingsHelper.GetValue<string>("blsp.BackendAPI.Base.Url", () => string.Empty), "Account/ConfirmUserRequest")
            };

            request.AddArgument("token", userDto.Token);
            request.AddArgument("email", userDto.UserName);
            request.AddArgument("firstName", userDto.FirstName);
            request.AddArgument("lastName", userDto.LastName);
            request.AddArgument("address", userDto.Address);
            request.AddArgument("cellphone", userDto.Cellphone);
            request.AddArgument("country", userDto.Country);
            request.AddArgument("state", userDto.State);
            request.AddArgument("city", userDto.City);
            request.AddArgument("zipcode", userDto.ZipCode);
            request.AddArgument("languageId", userDto.LanguageId);
            request.AddArgument("timezoneId", userDto.TimezoneId);
            request.AddArgument("password", userDto.Password);
            request.AddArgument("confirmPassword", userDto.ConfirmPassword);

            var response = HttpService.Post(request);

            if (response.Success)
            {
                return "ok";
            }

            return string.Empty;
        }
    }
}