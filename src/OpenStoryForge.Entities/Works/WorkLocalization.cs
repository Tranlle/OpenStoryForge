using System.ComponentModel.DataAnnotations;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品本地化文本实体。
/// </summary>
public class WorkLocalization : AggregateRoot<string>
{
    /// <summary>
    /// 所属作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkId { get; set; } = string.Empty;

    /// <summary>
    /// 语言区域，例如 zh-CN、en-US、ja-JP。
    /// </summary>
    [Required]
    [MaxLength(16)]
    public string Locale { get; set; } = string.Empty;

    /// <summary>
    /// 本地化标题。
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// 本地化副标题。
    /// </summary>
    [MaxLength(200)]
    public string? Subtitle { get; set; }

    /// <summary>
    /// 本地化短简介。
    /// </summary>
    [MaxLength(500)]
    public string? ShortDescription { get; set; }

    /// <summary>
    /// 本地化详情介绍。
    /// </summary>
    public string? Description { get; set; }
}
