using System.Text.Json.Serialization;
using API.Extensions;
using API.Features;
using API.Features.Quiz.API;
using API.Features.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.UI;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using NSwag.AspNetCore;
using Orleans;
using Orleans.Configuration;
using Orleans.Hosting;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration["postgres"];

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.Converters.Add(new StringEnumConverter());
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
            options.ServiceId = "playgroundservice";
        });
        silobuilder.UseDashboard(); // Only use in development due being CPU intensive
    }
    else
    {
        //silobuilder.ConfigureEndpoints(endpointAddress, siloPort, gatewayPort);
        silobuilder.Configure<ClusterOptions>(options =>
        {
            options.ClusterId = "dev";
            options.ServiceId = "playgroundservice";
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
        silobuilder.AddSimpleMessageStreamProvider(Constants.InMemorySteam); //.AddMemoryGrainStorage("PubSubStore");
    }

    silobuilder.ConfigureServices(sv =>
    {
        sv.AddSingleton<IOpenTdbClient, OpenTdbClient>();
        sv.AddHttpClient<IOpenTdbClient, OpenTdbClient>(client =>
        {
            client.BaseAddress = new Uri("https://opentdb.com/");
        });
    });
    silobuilder.AddMemoryGrainStorage("quizStore");
    silobuilder.AddMemoryGrainStorage("settingStore");
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
app.MapHub<GlobalHub>("/hub");

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