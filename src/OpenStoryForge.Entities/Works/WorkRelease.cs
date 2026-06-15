using System.ComponentModel.DataAnnotations;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品发布实体。
/// 表示某个版本在某个平台上的一次发布。
/// </summary>
public class WorkRelease : AggregateRoot<string>
{
    /// <summary>
    /// 所属作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkId { get; set; } = string.Empty;

    /// <summary>
    /// 发布对应的作品版本ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkVersionId { get; set; } = string.Empty;

    /// <summary>
    /// 发布类型/平台。
    /// </summary>
    public WorkReleaseType ReleaseType { get; set; } = WorkReleaseType.Web;

    /// <summary>
    /// 发布状态。
    /// </summary>
    public WorkReleaseStatus Status { get; set; } = WorkReleaseStatus.Draft;

    /// <summary>
    /// 构建包素材ID。
    /// </summary>
    [MaxLength(64)]
    public string? BuildAssetId { get; set; }

    /// <summary>
    /// 最低年龄限制。
    /// </summary>
    public int? MinAge { get; set; }

    /// <summary>
    /// 是否免费。
    /// </summary>
    public bool IsFree { get; set; } = true;

    /// <summary>
    /// 价格，单位分。
    /// </summary>
    public int? PriceCents { get; set; }

    /// <summary>
    /// 货币，例如 CNY、USD、JPY。
    /// </summary>
    [MaxLength(8)]
    public string? Currency { get; set; }

    /// <summary>
    /// 发布说明。
    /// </summary>
    [MaxLength(2000)]
    public string? ReleaseNotes { get; set; }

    /// <summary>
    /// 发布时间。
    /// </summary>
    public DateTime? ReleasedAt { get; set; }
}
