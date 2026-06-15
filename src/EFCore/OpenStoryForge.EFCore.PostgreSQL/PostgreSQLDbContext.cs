using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using OpenStoryForge.EFCore.DbInterceptor;

namespace OpenStoryForge.EFCore.PostgreSQL;

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
    public static IServiceCollection AddOpenStoryForgePostgreSql(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddDbInterceptor();

        services.AddPooledDbContextFactory<PostgreSQLDbContext>((sp, options) =>
        {
            options.UseNpgsql(connectionString);
            options.AddInterceptors(sp.GetRequiredService<EntitySaveChangesInterceptor>());
        });

        services.AddScoped<IContext>(sp =>
            sp.GetRequiredService<IDbContextFactory<PostgreSQLDbContext>>().CreateDbContext());

        services.AddSingleton<IContextFactory, PostgreSQLContextFactory>();

        return services;
    }
}
