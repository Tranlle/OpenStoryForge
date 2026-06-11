using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OpenStoryForge.EFCore.DbInterceptor;

namespace OpenStoryForge.EFCore.Sqlite;

public class SqliteDbContext(DbContextOptions<SqliteDbContext> options)
    : MasterDbContext(options)
{
}

public class SqliteContextFactory : IContextFactory
{
    private readonly IDbContextFactory<SqliteDbContext> _factory;

    public SqliteContextFactory(IDbContextFactory<SqliteDbContext> factory)
    {
        _factory = factory ?? throw new ArgumentNullException(nameof(factory));
    }

    public IContext CreateContext()
    {
        return _factory.CreateDbContext();
    }
}

public static class SqliteServiceCollectionExtensions
{
    public static IServiceCollection AddOpenStoryForgeSqlite(
        this IServiceCollection services,
        string connectionString)
    {
        // Register EF Core interceptors for logging and performance monitoring
        services.AddDbInterceptor();

        // Register pooled DbContext for both normal DI and factory usage
        services.AddPooledDbContextFactory<SqliteDbContext>((sp, options) =>
        {
            options.UseSqlite(connectionString);
            options.AddInterceptors(sp.GetRequiredService<EntitySaveChangesInterceptor>());
        });

        // Register IContext to resolve from the pool
        services.AddScoped<IContext>(sp =>
            sp.GetRequiredService<IDbContextFactory<SqliteDbContext>>().CreateDbContext());

        // Register IContextFactory
        services.AddSingleton<IContextFactory, SqliteContextFactory>();

        return services;
    }
}
