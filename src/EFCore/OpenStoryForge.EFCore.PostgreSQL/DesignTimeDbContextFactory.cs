using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OpenStoryForge.EFCore.PostgreSQL;

/// <summary>
/// 设计时数据库上下文工厂，用于EF Core迁移
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PostgreSQLDbContext>
{
    public PostgreSQLDbContext CreateDbContext(string[] args)
    {
        DbContextOptionsBuilder<PostgreSQLDbContext> optionsBuilder = new DbContextOptionsBuilder<PostgreSQLDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Database=openstoryforge;Username=postgres;Password=postgres");
        return new PostgreSQLDbContext(optionsBuilder.Options);
    }
}
