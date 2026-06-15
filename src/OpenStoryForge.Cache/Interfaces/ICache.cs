using OpenStoryForge.Cache.Options;

namespace OpenStoryForge.Cache.Interfaces;

/// <summary>
/// 字符串键值缓存网关。
/// Represents IRedisService.
/// </summary>
public interface ICache
{
    Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default);

    Task SetAsync<T>(string key, T value, CacheEntryOptions options, CancellationToken cancellationToken = default);

    Task RemoveAsync(string key, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default);

    Task<ICacheLock?> AcquireLockAsync(string key, TimeSpan timeout, CancellationToken cancellationToken = default);
}
