using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

using OpenStoryForge.Entities;

namespace OpenStoryForge.EFCore.DbInterceptor;

/// <summary>
/// 实体保存更改拦截器，用于在保存实体时自动设置审计信息（如创建时间、更新时间、删除时间等）
/// </summary>
public class EntitySaveChangesInterceptor : SaveChangesInterceptor
{
    private readonly TimeProvider _timeProvider;

    public EntitySaveChangesInterceptor(TimeProvider timeProvider)
    {
        _timeProvider = timeProvider;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        ApplyAuditInfo(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyAuditInfo(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    /// <summary>
    /// 用审计信息更新实体的 CreatedAt、UpdatedAt 和 DeletedAt 字段，并将删除操作转换为软删除
    /// </summary>
    /// <param name="dbContext"></param>
    private void ApplyAuditInfo(DbContext? dbContext)
    {
        if (dbContext is null)
        {
            return;
        }

        DateTime utcNow = _timeProvider.GetUtcNow().UtcDateTime;

        foreach (Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<IAuditableEntity> entry in
            dbContext.ChangeTracker.Entries<IAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    if (entry.Entity.CreatedAt == default)
                    {
                        entry.Entity.CreatedAt = utcNow;
                    }

                    entry.Entity.UpdatedAt = utcNow;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = utcNow;

                    // 防止 CreatedAt 被误改
                    entry.Property(x => x.CreatedAt).IsModified = false;
                    break;

                case EntityState.Deleted:
                    // 把硬删除改成软删除
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedAt = utcNow;
                    entry.Entity.UpdatedAt = utcNow;

                    entry.Property(x => x.CreatedAt).IsModified = false;
                    break;
            }
        }
    }
}
