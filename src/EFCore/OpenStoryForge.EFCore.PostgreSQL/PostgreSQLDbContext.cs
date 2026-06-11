using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OpenStoryForge.EFCore.DbInterceptor;

namespace OpenStoryForge.EFCore.Sqlite;

public class PostgreSQLDbContext(DbContextOptions<PostgreSQLDbContext> options)
    : MasterDbContext(options)
{
}

public class PostgreSQLContextFactory : IContextFactory
{
    private readonly IDbContextFactory<PostgreSQLDbContext> _factory;

    public PostgreSQLContextFactory(IDbContextFactory<PostgreSQLDbContext> factory)
    {
        _factory = factory ?? throw new ArgumentNullException(nameof(factory));
    }

    public IContext CreateContext()
    {
        return _factory.CreateDbContext();
    }
}

public static class PostgreSQLServiceCollectionExtensions
{
    public static IServiceCollection AddOpenStoryForgeSqlite(
        this IServiceCollection services,
        string connectionString)
    {
        // Register EF Core interceptors for logging and performance monitoring
        services.AddDbInterceptor();

        // Register pooled DbContext for both normal DI and factory usage
        services.AddPooledDbContextFactory<PostgreSQLDbContext>((sp, options) =>
        {
            options.UseNpgsql(connectionString);
            options.AddInterceptors(sp.GetRequiredService<EntitySaveChangesInterceptor>());
        });

        // Register IContext to resolve from the pool
        services.AddScoped<IContext>(sp =>
            sp.GetRequiredService<IDbContextFactory<PostgreSQLDbContext>>().CreateDbContext());

        // Register IContextFactory
        services.AddSingleton<IContextFactory, PostgreSQLContextFactory>();

        return services;
    }
}
