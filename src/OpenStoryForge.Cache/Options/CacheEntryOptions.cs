namespace OpenStoryForge.Cache.Options;

public sealed class CacheEntryOptions
{
    public TimeSpan? AbsoluteExpirationRelativeToNow { get; set; }
    public TimeSpan? SlidingExpiration { get; set; }
}
