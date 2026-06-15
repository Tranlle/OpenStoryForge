using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenStoryForge.EFCore;
using OpenStoryForge.Extensions;

namespace OpenStoryForge.UnitTest.Startup;

public class ServiceCollectionExtensionsTests
{
    [Fact]
    public void AddOpenStoryForgeServices_WithSqliteProvider_RegistersContextFactory()
    {
        ServiceCollection services = new ServiceCollection();
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Database:Provider"] = "Sqlite",
                ["Database:ConnectionString"] = "Data Source=test-startup.db"
            })
            .Build();

        services.AddOpenStoryForgeServices(configuration);

        using ServiceProvider serviceProvider = services.BuildServiceProvider();
        using IServiceScope scope = serviceProvider.CreateScope();

        IContextFactory? contextFactory = scope.ServiceProvider.GetService<IContextFactory>();

        Assert.NotNull(contextFactory);
    }
}
