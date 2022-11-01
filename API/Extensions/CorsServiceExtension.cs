namespace API.Extensions;

public static class CorsServiceExtension
{
    public static void AddCorsService(this IServiceCollection service, IConfiguration configuration)
    {
        service.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.AllowAnyOrigin()
                        .WithOrigins(configuration["Hosting:clientUrl"])
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
        });
    }
}