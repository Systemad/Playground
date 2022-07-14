using API.Extensions;
using API.Features.Quiz.API;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.UI;
using Newtonsoft.Json;
using NSwag.AspNetCore;
using Orleans;
using Orleans.Configuration;
using Orleans.Hosting;
using Refit;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration["postgres"];

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    //options.JsonSerializerOptions.ReferenceHandler = Newtonsoft.Json.ReferenceLoopHandling.Ignore,
    //options.SerializerSettings. PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddApiVersioning(config =>
{
    config.DefaultApiVersion = new ApiVersion(1, 0);
    // use default version when version is not specified
    config.AssumeDefaultVersionWhenUnspecified = true;
    // Advertise the API versions supported for the particular endpoint
    config.ReportApiVersions = true;
});

builder.Services.AddVersionedApiExplorer(setup =>
{
    setup.GroupNameFormat = "'v'VVV";
    setup.SubstituteApiVersionInUrl = true;
});

builder.Services.AddRouting(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});

builder.Services.AddRefitClient<IQuizPostApi>().ConfigureHttpClient(c => c.BaseAddress = new Uri("https://quizapi.io"));

// Add services to the container.
builder.Services.AddAppAuthentication(builder.Configuration);
builder.Services.AddSignalR();
builder.Services.AddCorsService();
builder.Services.AddOpenApiServiceOath(builder.Configuration);
builder.Services.AddRazorPages()
    .AddMicrosoftIdentityUI();

builder.Host.UseOrleans((context, silobuilder) =>
{
    if (context.HostingEnvironment.IsDevelopment())
    {
        silobuilder.UseLocalhostClustering();
        silobuilder.Configure<ClusterOptions>(options =>
        {
            options.ClusterId = "dev";
            options.ServiceId = "lookupservice";
        });
        silobuilder.UseDashboard(); // Only use in development due being CPU intensive
    }
    else
    {
        //silobuilder.ConfigureEndpoints(endpointAddress, siloPort, gatewayPort);
        silobuilder.Configure<ClusterOptions>(options =>
        {
            options.ClusterId = "dev";
            options.ServiceId = "lookupservice";
        });
        silobuilder.UseAdoNetClustering(opt =>
        {
            opt.Invariant = "Npgsql";
            opt.ConnectionString = connectionString;
        });
        silobuilder.AddAdoNetGrainStorageAsDefault(opt =>
        {
            opt.Invariant = "Npgsql";
            opt.ConnectionString = connectionString;
        });
    }
    //silobuilder.AddMemoryGrainStorage("AccountState");
    //silobuilder.AddMemoryGrainStorage("GlobalState");
    silobuilder.ConfigureLogging(
        log => log
            .AddFilter("Orleans.Runtime.Management.ManagementGrain", LogLevel.Warning)
            .AddFilter("Orleans.Runtime.SiloControl", LogLevel.Warning));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();
//app.MapHub<BaseHub>("/hub");

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi3(settings =>
    {
        settings.OAuth2Client = new OAuth2ClientSettings
        {
            ClientId = builder.Configuration["Swagger:ClientId"],
            AppName = "swagger-ui-client"
        };
    });
}

app.Run();