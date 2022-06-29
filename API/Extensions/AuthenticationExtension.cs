using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

namespace API.Extensions;

public static class AuthenticationExtension
{ 
    public static void AddAppAuthentication(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddMicrosoftIdentityWebApi(configuration.GetSection("AzureAdB2C"));

        services.Configure<JwtBearerOptions>(
            JwtBearerDefaults.AuthenticationScheme,
            options =>
            {
                options.TokenValidationParameters.NameClaimType = "name";
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        // If the request is for our hub...
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            (path.StartsWithSegments("/mainhub")))
                        {
                            // Read the token out of the query string
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

    }
}