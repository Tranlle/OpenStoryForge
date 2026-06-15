using System.ClientModel.Primitives;

using Microsoft.Extensions.Logging;

namespace OpenStoryForge.Agents.ClientLog;

internal static class ClientLogging
{
    /// <summary>
    /// 初始化 ClientLoggingOptions 
    /// 将日志输出到指定的 ILoggerFactory
    /// </summary>
    /// <param name="loggerFactory"></param>
    /// <returns></returns>
    public static ClientLoggingOptions InitialClientLoggingOptions(ILoggerFactory loggerFactory)
    {
        ClientLoggingOptions loggingOptions = new()
        {
            LoggerFactory = loggerFactory,
            EnableLogging = true,
            EnableMessageLogging = true,
            EnableMessageContentLogging = true,
            MessageContentSizeLimit = 64 * 1024,
        };

        // 可选：白名单（避免默认打码影响诊断）
        loggingOptions.AllowedHeaderNames.Add("Content-Type");
        loggingOptions.AllowedHeaderNames.Add("Accept");
        loggingOptions.AllowedHeaderNames.Add("Content-Length");
        loggingOptions.AllowedQueryParameters.Add("api-version");

        return loggingOptions;
    }
}
