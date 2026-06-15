using Microsoft.Extensions.Logging;
using System.ClientModel.Primitives;

namespace OpenStoryForge.Agents.ClientLog;

internal class ClientLogging
{
    /// <summary>
    /// 初始化 ClientLoggingOptions 
    /// 将日志输出到指定的 ILoggerFactory
    /// </summary>
    /// <param name="loggerFactory"></param>
    /// <returns></returns>
    public static ClientLoggingOptions InitialClientLoggingOptions(ILoggerFactory loggerFactory)
    {
        var loggingOptions = new ClientLoggingOptions();

        loggingOptions.LoggerFactory = loggerFactory;

        loggingOptions.EnableLogging = true;                    // 总开关：启用日志
        loggingOptions.EnableMessageLogging = true;             // 记录请求/响应的行与头
        loggingOptions.EnableMessageContentLogging = true;      // 记录请求/响应的完整内容
        loggingOptions.MessageContentSizeLimit = 64 * 1024;     // 增大到 64KB

        // 可选：白名单（避免默认打码影响诊断）
        loggingOptions.AllowedHeaderNames.Add("Content-Type");
        loggingOptions.AllowedHeaderNames.Add("Accept");
        loggingOptions.AllowedHeaderNames.Add("Content-Length");
        loggingOptions.AllowedQueryParameters.Add("api-version");

        return loggingOptions;
    }
}
