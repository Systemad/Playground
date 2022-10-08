using System.Text.Json.Serialization;

namespace API.Extensions;

public static class AddSignalR
{

    public static void AddSignalRApplication(this IServiceCollection service)
    {
        service.AddSignalR(options => { options.EnableDetailedErrors = true; }).AddJsonProtocol(options =>
        {
            options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });
        // Since there are resolver issues from PascalCase (C# class) to CamelCase Typescript
        // and no real good solution, we will be leaving this out for now
        //.AddMessagePackProtocol();

    }
}