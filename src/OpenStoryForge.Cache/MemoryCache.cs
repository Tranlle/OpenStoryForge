using System.Collections.Concurrent;

using Microsoft.Extensions.Caching.Memory;

using OpenStoryForge.Cache.Interfaces;
using OpenStoryForge.Cache.Options;

namespace OpenStoryForge.Cache;

/// <summary>
/// 内存缓存实现，使用 Microsoft.Extensions.Caching.Memory 包提供的 IMemoryCache。
/// 支持可选的所有权（ownership）：当 ownsCache 为 true 时，实例在 Dispose 时会释放注入的 IMemoryCache。
/// </summary>
/// <param name="cache">注入的 IMemoryCache 实例</param>
/// <param name="ownsCache">是否由当前实例拥有并负责在 Dispose 时释放注入的 IMemoryCache</param>
public sealed class MemoryCache(IMemoryCache cache, bool ownsCache = false) : ICache, IDisposable, IAsyncDisposable
{
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new(StringComparer.Ordinal);

    private readonly IMemoryCache _cache = cache;
    private readonly bool _ownsCache = ownsCache;
    private bool _disposed;

    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(_cache.TryGetValue(key, out T? value) ? value : default);
    }

    public Task SetAsync<T>(string key, T value, CacheEntryOptions options, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        cancellationToken.ThrowIfCancellationRequested();
        MemoryCacheEntryOptions entryOptions = new();

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
        ThrowIfDisposed();
        cancellationToken.ThrowIfCancellationRequested();
        _cache.Remove(key);
        return Task.CompletedTask;
    }

    public Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(_cache.TryGetValue(key, out _));
    }

    /// <summary>
    /// 尝试为指定的缓存键获取一个互斥锁，以确保在同一时间只有一个线程可以访问该键对应的缓存操作。
    /// </summary>
    /// <param name="key">用于区分不同缓存项的键。不得为null或空字符串；传入null会导致底层集合操作抛出异常（例如 <see cref="ArgumentNullException"/>）。</param>
    /// <param name="timeout">尝试获取锁的最长等待时长。如果在此时间内未能获取到锁，方法将返回null</param>
    /// <param name="cancellationToken">取消令牌。若在等待期间触发取消，则会抛出 <see cref="OperationCanceledException"/>。</param>
    /// <returns>
    /// 成功获取到锁时返回一个实现 <see cref="ICacheLock"/> 的实例（当前实现为MemoryCacheLock），该实例负责在释放时归还内部的 <see cref="SemaphoreSlim"/>。
    /// 如果在指定的 <paramref name="timeout"/> 内未能获取锁，则返回null。
    /// </returns>
    /// <remarks>
    /// 方法通过内部的锁字典按键维护一个 <see cref="SemaphoreSlim"/> 实例：使用_locks.GetOrAdd(key, ...) 获取或创建信号量，然后调用 <see cref="SemaphoreSlim.WaitAsync"/> 尝试获取锁。
    /// 返回的 <see cref="ICacheLock"/> 在释放或处置时会调用 <see cref="SemaphoreSlim.Release"/>，允许其他等待者继续获取该键的锁。
    /// </remarks>
    /// <exception cref="OperationCanceledException">当 <paramref name="cancellationToken"/> 在等待期间被取消时抛出。</exception>
    public async Task<ICacheLock?> AcquireLockAsync(string key, TimeSpan timeout, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        cancellationToken.ThrowIfCancellationRequested();
        SemaphoreSlim semaphore = _locks.GetOrAdd(key, static _ => new SemaphoreSlim(1, 1));
        bool acquired = await semaphore.WaitAsync(timeout, cancellationToken).ConfigureAwait(false);
        if (!acquired)
        {
            return null;
        }

        return new MemoryCacheLock(semaphore);
    }

    private sealed class MemoryCacheLock(SemaphoreSlim semaphore) : ICacheLock
    {
        private readonly SemaphoreSlim _semaphore = semaphore;
        private bool _disposed;

        public void Dispose()
        {
            if (_disposed)
            {
                return;
            }

            _semaphore.Release();
            _disposed = true;
        }

        public ValueTask DisposeAsync()
        {
            if (_disposed)
            {
                return ValueTask.CompletedTask;
            }

            _semaphore.Release();
            _disposed = true;
            return ValueTask.CompletedTask;
        }
    }

    private void ThrowIfDisposed()
    {
        ObjectDisposedException.ThrowIf(_disposed, nameof(MemoryCache));
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;

        if (_ownsCache && _cache is IDisposable disposable)
        {
            disposable.Dispose();
        }

        // Intentionally not disposing semaphores stored in the static _locks dictionary here.
        // They may be shared by other instances or threads; disposing them prematurely could cause
        // ObjectDisposedException for other users. If desired, implement a cleanup strategy
        // with reference counting and explicit removal from _locks.
    }

    public async ValueTask DisposeAsync()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;

        if (_ownsCache)
        {
            if (_cache is IAsyncDisposable asyncDisposable)
            {
                await asyncDisposable.DisposeAsync().ConfigureAwait(false);
                return;
            }

            if (_cache is IDisposable disposable)
            {
                disposable.Dispose();
            }
        }
    }
}
