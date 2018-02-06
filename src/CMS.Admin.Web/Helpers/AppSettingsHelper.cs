using System;
using System.Configuration;

namespace blsp.Admin.Web.Helpers
{
    public static class AppSettingsHelper
    {
        public static TResult GetValue<TResult>(string key, Func<TResult> defaultValue = null)
        {
            if (!string.IsNullOrWhiteSpace(key))
            {
                var keyValue = ConfigurationManager.AppSettings[key];
                if (!string.IsNullOrWhiteSpace(key))
                {
                    try
                    {
                        return (TResult)Convert.ChangeType(ConfigurationManager.AppSettings[key], typeof(TResult));
                    }
                    catch (Exception ex) { }
                }
            }

            if (defaultValue != null)
            {
                try
                {
                    return defaultValue.Invoke();
                }
                catch (Exception ex) { }
            }

            return default(TResult);
        }

    }
}