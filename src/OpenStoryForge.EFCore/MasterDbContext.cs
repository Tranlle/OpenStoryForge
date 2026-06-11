using Microsoft.EntityFrameworkCore;
using OpenStoryForge.Entities;
using OpenStoryForge.Entities.Tools;

namespace OpenStoryForge.EFCore;

public interface IContext : IDisposable
{
    DbSet<User> Users { get; set; }
    DbSet<Role> Roles { get; set; }
    DbSet<UserRole> UserRoles { get; set; }
    DbSet<OAuthProvider> OAuthProviders { get; set; }
    DbSet<UserOAuth> UserOAuths { get; set; }
    DbSet<LocalStorage> LocalStorages { get; set; }
    DbSet<Department> Departments { get; set; }
    DbSet<GitHubAppInstallation> GitHubAppInstallations { get; set; }
    DbSet<TokenUsage> TokenUsages { get; set; }
    DbSet<SystemSetting> SystemSettings { get; set; }
    DbSet<SkillConfig> SkillConfigs { get; set; }
    DbSet<AiProviderConfig> AiProviderConfigs { get; set; }
    DbSet<AiModelConfig> AiModelConfigs { get; set; }
    DbSet<ModelConfig> ModelConfigs { get; set; }
    DbSet<ChatSession> ChatSessions { get; set; }
    DbSet<ChatMessageHistory> ChatMessageHistories { get; set; }
    DbSet<ChatShareSnapshot> ChatShareSnapshots { get; set; }
    DbSet<ChatProviderConfig> ChatProviderConfigs { get; set; }
    DbSet<ChatMessageQueue> ChatMessageQueues { get; set; }
    DbSet<UserDepartment> UserDepartments { get; set; }
    DbSet<UserPreferenceCache> UserPreferenceCaches { get; set; }
    DbSet<ChatAssistantConfig> ChatAssistantConfigs { get; set; }
    DbSet<ChatApp> ChatApps { get; set; }
    DbSet<AppStatistics> AppStatistics { get; set; }
    DbSet<ChatLog> ChatLogs { get; set; }
    DbSet<ApiKey> ApiKeys { get; set; }

    DbSet<Work> Works { get; set; }
    DbSet<WorkVersion> WorkVersions { get; set; }
    DbSet<WorkAsset> WorkAssets { get; set; }
    DbSet<WorkLocalization> WorkLocalizations { get; set; }
    DbSet<WorkContributor> WorkContributors { get; set; }
    DbSet<Tag> Tags { get; set; }
    DbSet<WorkTag> WorkTags { get; set; }
    DbSet<WorkAiProfile> WorkAiProfiles { get; set; }
    DbSet<WorkStats> WorkStats { get; set; }
    DbSet<WorkRelation> WorkRelations { get; set; }
    DbSet<WorkRelease> WorkReleases { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

public abstract class MasterDbContext : DbContext, IContext
{
    protected MasterDbContext(DbContextOptions options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<UserRole> UserRoles { get; set; } = null!;
    public DbSet<OAuthProvider> OAuthProviders { get; set; } = null!;
    public DbSet<UserOAuth> UserOAuths { get; set; } = null!;
    public DbSet<LocalStorage> LocalStorages { get; set; } = null!;
    public DbSet<Department> Departments { get; set; } = null!;
    public DbSet<GitHubAppInstallation> GitHubAppInstallations { get; set; } = null!;
    public DbSet<TokenUsage> TokenUsages { get; set; } = null!;
    public DbSet<SystemSetting> SystemSettings { get; set; } = null!;
    public DbSet<SkillConfig> SkillConfigs { get; set; } = null!;
    public DbSet<AiProviderConfig> AiProviderConfigs { get; set; } = null!;
    public DbSet<AiModelConfig> AiModelConfigs { get; set; } = null!;
    public DbSet<ModelConfig> ModelConfigs { get; set; } = null!;
    public DbSet<ChatSession> ChatSessions { get; set; } = null!;
    public DbSet<ChatMessageHistory> ChatMessageHistories { get; set; } = null!;
    public DbSet<ChatShareSnapshot> ChatShareSnapshots { get; set; } = null!;
    public DbSet<ChatProviderConfig> ChatProviderConfigs { get; set; } = null!;
    public DbSet<ChatMessageQueue> ChatMessageQueues { get; set; } = null!;
    public DbSet<UserDepartment> UserDepartments { get; set; } = null!;
    public DbSet<UserPreferenceCache> UserPreferenceCaches { get; set; } = null!;
    public DbSet<ChatAssistantConfig> ChatAssistantConfigs { get; set; } = null!;
    public DbSet<ChatApp> ChatApps { get; set; } = null!;
    public DbSet<AppStatistics> AppStatistics { get; set; } = null!;
    public DbSet<ChatLog> ChatLogs { get; set; } = null!;
    public DbSet<ApiKey> ApiKeys { get; set; } = null!;
    public DbSet<Work> Works { get; set; } = null!;
    public DbSet<WorkVersion> WorkVersions { get; set; } = null!;
    public DbSet<WorkAsset> WorkAssets { get; set; } = null!;
    public DbSet<WorkLocalization> WorkLocalizations { get; set; } = null!;
    public DbSet<WorkContributor> WorkContributors { get; set; } = null!;
    public DbSet<Tag> Tags { get; set; } = null!;
    public DbSet<WorkTag> WorkTags { get; set; } = null!;
    public DbSet<WorkAiProfile> WorkAiProfiles { get; set; } = null!;
    public DbSet<WorkStats> WorkStats { get; set; } = null!;
    public DbSet<WorkRelation> WorkRelations { get; set; } = null!;
    public DbSet<WorkRelease> WorkReleases { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Department>()
            .HasOne(department => department.Parent)
            .WithMany()
            .HasForeignKey(department => department.ParentId);

        // TokenUsage 索引（按记录时间查询统计）
        modelBuilder.Entity<TokenUsage>(builder =>
        {
            builder.HasIndex(t => t.RecordedAt);
            builder.Property(t => t.InputTokenPrice).HasPrecision(18, 8);
            builder.Property(t => t.OutputTokenPrice).HasPrecision(18, 8);
            builder.Property(t => t.CacheHitTokenPrice).HasPrecision(18, 8);
            builder.Property(t => t.CacheCreationTokenPrice).HasPrecision(18, 8);
            builder.Property(t => t.InputCost).HasPrecision(18, 8);
            builder.Property(t => t.OutputCost).HasPrecision(18, 8);
            builder.Property(t => t.TotalCost).HasPrecision(18, 8);
        });

        // SystemSetting 唯一键索引
        modelBuilder.Entity<SystemSetting>()
            .HasIndex(s => s.Key)
            .IsUnique();

        // SkillConfig 名称唯一索引
        modelBuilder.Entity<SkillConfig>()
            .HasIndex(s => s.Name)
            .IsUnique();

        // ModelConfig 名称唯一索引
        modelBuilder.Entity<AiProviderConfig>(builder =>
        {
            builder.HasIndex(p => p.Name).IsUnique();
            builder.HasIndex(p => p.IsActive);
        });

        modelBuilder.Entity<AiModelConfig>(builder =>
        {
            builder.HasIndex(m => new { m.ProviderId, m.ModelId }).IsUnique();
            builder.HasIndex(m => m.IsActive);
            builder.Property(m => m.ProviderType).HasMaxLength(50);
            builder.Property(m => m.InputTokenPrice).HasPrecision(18, 8);
            builder.Property(m => m.OutputTokenPrice).HasPrecision(18, 8);
            builder.Property(m => m.CacheHitTokenPrice).HasPrecision(18, 8);
            builder.Property(m => m.CacheCreationTokenPrice).HasPrecision(18, 8);
        });

        modelBuilder.Entity<ModelConfig>()
            .HasIndex(m => m.Name)
            .IsUnique();

        modelBuilder.Entity<ModelConfig>()
            .HasIndex(m => new { m.AiProviderId, m.ModelId });

        // ChatSession 用户和平台组合唯一索引
        modelBuilder.Entity<ChatSession>()
            .HasIndex(s => new { s.UserId, s.Platform })
            .IsUnique();

        // ChatSession 状态索引（用于查询活跃会话）
        modelBuilder.Entity<ChatSession>()
            .HasIndex(s => s.State);

        // ChatMessageHistory 与 ChatSession 关联
        modelBuilder.Entity<ChatMessageHistory>()
            .HasOne(m => m.Session)
            .WithMany(s => s.Messages)
            .HasForeignKey(m => m.SessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // ChatMessageHistory 会话ID和时间戳索引（用于按时间查询消息）
        modelBuilder.Entity<ChatMessageHistory>()
            .HasIndex(m => new { m.SessionId, m.MessageTimestamp });

        // ChatShareSnapshot ShareId 唯一索引
        modelBuilder.Entity<ChatShareSnapshot>()
            .HasIndex(s => s.ShareId)
            .IsUnique();

        // ChatShareSnapshot 过期时间索引
        modelBuilder.Entity<ChatShareSnapshot>()
            .HasIndex(s => s.ExpiresAt);

        // ChatProviderConfig 平台唯一索引
        modelBuilder.Entity<ChatProviderConfig>()
            .HasIndex(c => c.Platform)
            .IsUnique();

        // ChatMessageQueue 状态和计划时间索引（用于出队处理）
        modelBuilder.Entity<ChatMessageQueue>()
            .HasIndex(q => new { q.Status, q.ScheduledAt });

        // ChatMessageQueue 平台和目标用户索引（用于按用户查询队列）
        modelBuilder.Entity<ChatMessageQueue>()
            .HasIndex(q => new { q.Platform, q.TargetUserId });

        // UserDepartment 唯一索引（同一用户在同一部门只能有一条记录）
        modelBuilder.Entity<UserDepartment>()
            .HasIndex(ud => new { ud.UserId, ud.DepartmentId })
            .IsUnique();

        // UserPreferenceCache 用户ID唯一索引
        modelBuilder.Entity<UserPreferenceCache>()
            .HasIndex(p => p.UserId)
            .IsUnique();

        // ChatApp AppId唯一索引
        modelBuilder.Entity<ChatApp>()
            .HasIndex(a => a.AppId)
            .IsUnique();

        // ChatApp 用户ID索引（用于查询用户的应用列表）
        modelBuilder.Entity<ChatApp>()
            .HasIndex(a => a.UserId);

        // AppStatistics AppId和日期组合唯一索引
        modelBuilder.Entity<AppStatistics>()
            .HasIndex(s => new { s.AppId, s.Date })
            .IsUnique();

        // ChatLog AppId索引（用于按应用查询提问记录）
        modelBuilder.Entity<ChatLog>()
            .HasIndex(l => l.AppId);

        // ChatLog 创建时间索引（用于按时间范围查询）
        modelBuilder.Entity<ChatLog>()
            .HasIndex(l => l.CreatedAt);

        // GitHubAppInstallation unique index on InstallationId
        modelBuilder.Entity<GitHubAppInstallation>()
            .HasIndex(g => g.InstallationId)
            .IsUnique();

        // GitHubAppInstallation optional FK to Department
        modelBuilder.Entity<GitHubAppInstallation>()
            .HasOne<Department>()
            .WithMany()
            .HasForeignKey(g => g.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        // ApiKey indexes
        modelBuilder.Entity<ApiKey>(entity =>
        {
            entity.HasIndex(e => e.KeyPrefix).IsUnique();
            entity.HasIndex(e => e.UserId);
        });

        ConfigureWorksModel(modelBuilder);
    }

    private static void ConfigureWorksModel(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Work>(builder =>
        {
            builder.HasIndex(x => new { x.TenantId, x.Slug }).IsUnique();
            builder.HasIndex(x => new { x.TenantId, x.OwnerUserId, x.Status });
            builder.HasIndex(x => new { x.TenantId, x.Visibility, x.Status, x.PublishedAt });
            builder.HasIndex(x => x.SourceWorkId);
            builder.Property(x => x.Status).HasConversion<string>();
            builder.Property(x => x.Visibility).HasConversion<string>();
            builder.Property(x => x.ModerationStatus).HasConversion<string>();
            builder.Property(x => x.CreationMode).HasConversion<string>();
            builder.Property(x => x.ContentRating).HasConversion<string>();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.SourceWorkId).OnDelete(DeleteBehavior.Restrict);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkVersion>(builder =>
        {
            builder.HasIndex(x => new { x.WorkId, x.VersionNumber }).IsUnique();
            builder.HasIndex(x => new { x.WorkId, x.Status });
            builder.Property(x => x.Status).HasConversion<string>();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.WorkId);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkAsset>(builder =>
        {
            builder.HasIndex(x => new { x.WorkId, x.AssetType });
            builder.HasIndex(x => new { x.WorkId, x.Role });
            builder.HasIndex(x => x.ContentHash);
            builder.Property(x => x.AssetType).HasConversion<string>();
            builder.Property(x => x.Source).HasConversion<string>();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.WorkId);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkLocalization>(builder =>
        {
            builder.HasIndex(x => new { x.WorkId, x.Locale }).IsUnique();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.WorkId);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkContributor>(builder =>
        {
            builder.HasIndex(x => new { x.WorkId, x.Role });
            builder.HasIndex(x => new { x.WorkId, x.SortOrder });
            builder.Property(x => x.Role).HasConversion<string>();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.WorkId);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<Tag>(builder =>
        {
            builder.HasIndex(x => x.Slug).IsUnique();
            builder.HasIndex(x => new { x.Category, x.IsSystem });
            builder.Property(x => x.Category).HasConversion<string>();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkTag>(builder =>
        {
            builder.HasIndex(x => new { x.WorkId, x.TagId }).IsUnique();
            builder.HasIndex(x => new { x.TagId, x.WorkId });
            builder.Property(x => x.Source).HasConversion<string>();
            builder.Property(x => x.Confidence).HasPrecision(5, 4);
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.WorkId);
            builder.HasOne<Tag>().WithMany().HasForeignKey(x => x.TagId);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkAiProfile>(builder =>
        {
            builder.HasIndex(x => x.WorkId).IsUnique();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.WorkId);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkStats>(builder =>
        {
            builder.HasIndex(x => x.WorkId).IsUnique();
            builder.HasIndex(x => new { x.PlayCount, x.LikeCount });
            builder.Property(x => x.RatingAverage).HasPrecision(4, 2);
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.WorkId);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkRelation>(builder =>
        {
            builder.HasIndex(x => new { x.SourceWorkId, x.TargetWorkId, x.RelationType }).IsUnique();
            builder.HasIndex(x => x.TargetWorkId);
            builder.Property(x => x.RelationType).HasConversion<string>();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.SourceWorkId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.TargetWorkId).OnDelete(DeleteBehavior.Restrict);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
        modelBuilder.Entity<WorkRelease>(builder =>
        {
            builder.HasIndex(x => new { x.WorkId, x.WorkVersionId, x.ReleaseType }).IsUnique();
            builder.HasIndex(x => new { x.WorkId, x.Status });
            builder.Property(x => x.ReleaseType).HasConversion<string>();
            builder.Property(x => x.Status).HasConversion<string>();
            builder.Property(x => x.Version).IsRowVersion();
            builder.HasOne<Work>().WithMany().HasForeignKey(x => x.WorkId);
            builder.HasOne<WorkVersion>().WithMany().HasForeignKey(x => x.WorkVersionId);
            builder.HasQueryFilter(x => !x.IsDeleted);
        });
    }

}
