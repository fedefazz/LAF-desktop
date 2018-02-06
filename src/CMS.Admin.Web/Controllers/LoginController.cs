using System;
using System.Web.Mvc;
using blsp.Admin.Web.Models;
using blsp.Admin.Web.Helpers;
using Newtonsoft.Json;
using System.Dynamic;

namespace blsp.Admin.Web.Controllers
{
    public class LoginController : Controller
    {
        [HttpGet]
        public ActionResult ResetPassword(string email, string token)
        {
            if (!string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(token))
            {
                LoadUserToViewBag(email, token);
                return View();
            }

            return RedirectToAction("LogOn");
        }

        [HttpPost]
        public ActionResult ResetPassword(ResetPasswordDto dto)
        {
            if (ModelState.IsValid)
            {
                var response = BackendAPIFacade.ResetPassword(dto);

                if (!string.IsNullOrWhiteSpace(response))
                {
                    //TODO: check confirm was ok
                    return RedirectToAction("ResetPasswordSuccess");
                }
            }

            LoadUserToViewBag(dto.Email, dto.Token);
            ModelState.AddModelError("CONFIRMFAIL", "CONFIRMFAIL");
            return View();
        }

        [HttpGet]
        public ActionResult ResetPasswordSuccess()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ForgotPassword(string userName)
        {
            if (!string.IsNullOrWhiteSpace(userName))
                BackendAPIFacade.ForgotPassword(userName);

            return View("ForgotPasswordSuccess");
        }

        [HttpGet]
        public ActionResult ForgotPasswordSuccess()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ConfirmUserRequest(int userId, string token)
        {
            if (userId > 0 && !string.IsNullOrWhiteSpace(token))
            {
                LoadUserRequestToViewBag(userId, token);

                if (ViewBag.ConfirmUser != null)
                    return View();
            }

            return RedirectToAction("LogOn");
        }

        [HttpPost]
        public ActionResult ConfirmUserRequest(UserDto dto)
        {
            if (ModelState.IsValid)
            {
                var response = BackendAPIFacade.ConfirmUserRequest(dto);

                if (!string.IsNullOrWhiteSpace(response))
                {
                    //TODO: check confirm was ok
                    return RedirectToAction("ConfirmUserRequestSuccess");
                }
            }

            LoadUserRequestToViewBag(dto.Id, dto.Token);

            if (ViewBag.ConfirmUser == null)
            {
                ModelState.AddModelError("CONFIRMFAIL", "CONFIRMFAIL");
                return View();
            }

            return RedirectToAction("LogOn");
        }

        [HttpGet]
        public ActionResult ConfirmUserRequestSuccess()
        {
            return View();
        }

        [HttpGet]
        public ActionResult LogOn(string returnUrl)
        {
            return View(new LoginDto
            {
                UserName = string.Empty,
                ReturnUrl = returnUrl
            });
        }

        [HttpPost]
        public ActionResult LogOn(LoginDto dto)
        {
            if (ModelState.IsValid)
            {
                var response = BackendAPIFacade.GetToken(dto.UserName, dto.Password);

                if (!string.IsNullOrWhiteSpace(response))
                {
                    var json = JsonConvert.DeserializeObject<dynamic>(response);

                    if (json.access_token != null)
                    {
                        FormsAuthenticationHelper.SaveAuthCookie(dto.UserName, false);
                        Session["access_token"] = json.access_token;
                        var redirectUrl = !string.IsNullOrEmpty(dto.ReturnUrl) && !IsAbsoluteUrl(dto.ReturnUrl) ? dto.ReturnUrl : "/";
                        return Redirect(redirectUrl);
                    }
                }
            }

            ModelState.AddModelError("LOGINFAIL", "The username or password provided is incorrect.");
            return View(dto);
        }

        [HttpGet]
        public ActionResult LogOut()
        {
            FormsAuthenticationHelper.SignOut();
            Session.Abandon();

            return RedirectToAction("LogOn");
        }

        private bool IsAbsoluteUrl(string url)
        {
            Uri result;
            return Uri.TryCreate(url, UriKind.Absolute, out result);
        }

        private void LoadUserRequestToViewBag(int id, string token)
        {
            var json = BackendAPIFacade.GetUserRequest(id, token);

            if (!string.IsNullOrWhiteSpace(json))
            {
                var result = JsonConvert.DeserializeObject<dynamic>(json);

                if (result != null && result.data != null)
                {
                    var userdata = result.data;
                    userdata.Token = token;
                    userdata.Id = id;

                    ViewBag.ConfirmUser = userdata;

                    return;
                }
            }

            ViewBag.ConfirmUser = null;
        }

        private void LoadUserToViewBag(string email, string token)
        {
            dynamic userdata = new ExpandoObject();

            userdata.Token = token;
            userdata.Email = email;

            ViewBag.User = userdata;
        }
    }
}