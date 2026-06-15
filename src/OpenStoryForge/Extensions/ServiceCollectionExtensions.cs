using OpenStoryForge.Configuration;
using OpenStoryForge.EFCore.PostgreSQL;
using OpenStoryForge.EFCore.Sqlite;

namespace OpenStoryForge.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddOpenStoryForgeServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddControllers();
        services.AddOpenApi();
        services.AddSingleton(TimeProvider.System);

        services
            .AddOptions<DatabaseOptions>()
            .Bind(configuration.GetSection(DatabaseOptions.SectionName));

        DatabaseOptions databaseOptions = configuration
            .GetSection(DatabaseOptions.SectionName)
            .Get<DatabaseOptions>()
            ?? throw new InvalidOperationException("Database configuration is required.");

        if (string.IsNullOrWhiteSpace(databaseOptions.ConnectionString))
        {
            throw new InvalidOperationException("Database:ConnectionString is required.");
        }

        switch (databaseOptions.Provider.Trim().ToLowerInvariant())
        {
            case "sqlite":
                services.AddOpenStoryForgeSqlite(databaseOptions.ConnectionString);
                break;

            case "postgresql":
            case "postgres":
                services.AddOpenStoryForgePostgreSql(databaseOptions.ConnectionString);
                break;

            default:
                throw new InvalidOperationException(
                    $"Unsupported database provider '{databaseOptions.Provider}'.");
        }

        //services.AddAgentModule();

        return services;
    }
}
