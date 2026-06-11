using Microsoft.Extensions.Caching.Memory;
using OpenStoryForge.Cache.Interfaces;
using OpenStoryForge.Cache.Options;
using System.Collections.Concurrent;

namespace OpenStoryForge.Cache;

/// <summary>
/// 内存缓存实现，使用 Microsoft.Extensions.Caching.Memory 包提供的 IMemoryCache。
/// </summary>
/// <param name="cache"></param>
public sealed class MemoryCache(IMemoryCache cache) : ICache
{
    private readonly IMemoryCache _cache = cache;
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(_cache.TryGetValue(key, out T? value) ? value : default);
    }

    public Task SetAsync<T>(string key, T value, CacheEntryOptions options, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var entryOptions = new MemoryCacheEntryOptions();

        if (options.AbsoluteExpirationRelativeToNow.HasValue)
        {
            entryOptions.SetAbsoluteExpiration(options.AbsoluteExpirationRelativeToNow.Value);
        }

        if (options.SlidingExpiration.HasValue)
        {
            entryOptions.SetSlidingExpiration(options.SlidingExpiration.Value);
        }

        _cache.Set(key, value, entryOptions);
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _cache.Remove(key);
        return Task.CompletedTask;
    }

    public Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(_cache.TryGetValue(key, out _));
    }

    /// <summary>
    /// 尝试为指定的缓存键获取一个互斥锁，以确保在同一时间只有一个线程可以访问该键对应的缓存操作。
    /// </summary>
    /// <param name="key">用于区分不同缓存项的键。不得为null或空字符串；传入null会导致底层集合操作抛出异常（例如 <see cref="ArgumentNullException"/>）。</param>
    /// <param name="timeout">尝试获取锁的最长等待时长。如果在此时间内未能获取到锁，方法将返回 <c>null</c>。</param>
    /// <param name="cancellationToken">取消令牌。若在等待期间触发取消，则会抛出 <see cref="OperationCanceledException"/>。</param>
    /// <returns>
    /// 成功获取到锁时返回一个实现 <see cref="ICacheLock"/> 的实例（当前实现为 <c>MemoryCacheLock</c>），该实例负责在释放时归还内部的 <see cref="SemaphoreSlim"/>。
    /// 如果在指定的 <paramref name="timeout"/> 内未能获取锁，则返回 <c>null</c>。
    /// </returns>
    /// <remarks>
    /// 方法通过内部的锁字典按键维护一个 <see cref="SemaphoreSlim"/> 实例：使用 <c>_locks.GetOrAdd(key, ...)</c> 获取或创建信号量，然后调用 <see cref="SemaphoreSlim.WaitAsync"/> 尝试获取锁。
    /// 返回的 <see cref="ICacheLock"/> 在释放或处置时会调用 <see cref="SemaphoreSlim.Release"/>，允许其他等待者继续获取该键的锁。
    /// </remarks>
    /// <exception cref="OperationCanceledException">当 <paramref name="cancellationToken"/> 在等待期间被取消时抛出。</exception>
    public async Task<ICacheLock?> AcquireLockAsync(string key, TimeSpan timeout, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var semaphore = _locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
        var acquired = await semaphore.WaitAsync(timeout, cancellationToken);
        if (!acquired)
        {
            return null;
        }

        return new MemoryCacheLock(key, semaphore);
    }

    private sealed class MemoryCacheLock : ICacheLock
    {
        private readonly string _key;
        private readonly SemaphoreSlim _semaphore;
        private bool _disposed;

        public MemoryCacheLock(string key, SemaphoreSlim semaphore)
        {
            _key = key;
            _semaphore = semaphore;
        }

        public void Dispose()
        {
            if (_disposed) return;
            _semaphore.Release();
            _disposed = true;
        }

        public ValueTask DisposeAsync()
        {
            Dispose();
            return ValueTask.CompletedTask;
        }
    }
}
