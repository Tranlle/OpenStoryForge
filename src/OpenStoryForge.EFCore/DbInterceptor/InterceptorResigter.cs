using Microsoft.Extensions.DependencyInjection;

namespace OpenStoryForge.EFCore.DbInterceptor;

/// <summary>
/// EF Core拦截器注册类，用于将自定义的拦截器添加到依赖注入容器中
/// </summary>
public static class InterceptorResigter
{
    public static void AddDbInterceptor(this IServiceCollection services)
    {
        services.AddSingleton<EntitySaveChangesInterceptor>();

    }
}
