using NSwag;
using NSwag.Generation.Processors.Security;

namespace API.Extensions;

public static class AddOpenApi
{
    public static void AddOpenApiServiceOath(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOpenApiDocument(configure =>
        {
            configure.DocumentName = "v1";
            configure.Version = "v1";
            configure.Title = "Lookup API";
            configure.Description = "Backend API for Lookup";
            configure.AddSecurity("bearer", Enumerable.Empty<string>(), new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.OAuth2,
                Name = "Authorization",
                //In = OpenApiSecurityApiKeyLocation.Header,
                Description = "Type into the text box: Bearer {your JWT token}.",
                Scheme = "Bearer",
                Flow = OpenApiOAuth2Flow.Implicit,
                Flows = new OpenApiOAuthFlows()
                {
                    Implicit = new OpenApiOAuthFlow()
                    {
                        AuthorizationUrl = configuration["Swagger:AuthorizationUrl"],
                        TokenUrl = configuration["Swagger:TokenUrl"],
                        Scopes = new Dictionary<string, string>
                        {
                            {
                                configuration["Swagger:Scope1"],
                                "Access the api as the signed-in user"
                            }
                        }
                    }
                }
            });
            configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("bearer"));
        });
    }
    
}