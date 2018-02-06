using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace blsp.Admin.Web.Extensions
{
    public static class ValidationSummaryExtension
    {
        public static MvcHtmlString CustomValidationSummary(this HtmlHelper helper)
        {
            if (helper.ViewData.ModelState.IsValid)
                return MvcHtmlString.Create(string.Empty);

            var div = new TagBuilder("div");
            div.AddCssClass("field-validation-error alert alert-danger");

            foreach (var key in helper.ViewData.ModelState.Keys)
            {
                foreach (var err in helper.ViewData.ModelState[key].Errors)
                {
                    var p = new TagBuilder("p");
                    p.InnerHtml = helper.Encode(err.ErrorMessage);
                    div.InnerHtml = p.ToString(TagRenderMode.Normal);
                }
            }
            return MvcHtmlString.Create(div.ToString(TagRenderMode.Normal));
        }
    }
}