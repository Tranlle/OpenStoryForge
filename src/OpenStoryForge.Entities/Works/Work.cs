using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品实体
/// </summary>
public class Work : AggregateRoot<string>
{
    /// <summary>
    /// 租户/空间ID。可代表个人空间、团队空间、组织空间。
    /// </summary>
    public Guid TenantId { get; set; }

    /// <summary>
    /// 作品拥有者用户ID。
    /// </summary>
    public Guid OwnerUserId { get; set; }

    /// <summary>
    /// 作品标题。
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// URL 友好标识。
    /// </summary>
    [Required]
    [MaxLength(220)]
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// 副标题。
    /// </summary>
    [MaxLength(200)]
    public string? Subtitle { get; set; }

    /// <summary>
    /// 短简介，用于作品卡片、列表页、搜索结果。
    /// </summary>
    [MaxLength(500)]
    public string? ShortDescription { get; set; }

    /// <summary>
    /// 作品详情介绍。
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// 封面素材ID。
    /// </summary>
    [MaxLength(64)]
    public string? CoverAssetId { get; set; }

    /// <summary>
    /// 详情页头图素材ID。
    /// </summary>
    [MaxLength(64)]
    public string? HeroAssetId { get; set; }

    /// <summary>
    /// 当前草稿版本ID。
    /// </summary>
    [MaxLength(64)]
    public string? CurrentDraftVersionId { get; set; }

    /// <summary>
    /// 当前已发布版本ID。
    /// </summary>
    [MaxLength(64)]
    public string? PublishedVersionId { get; set; }

    /// <summary>
    /// 主要语言，例如 zh-CN / en-US / ja-JP。
    /// </summary>
    [Required]
    [MaxLength(16)]
    public string PrimaryLanguage { get; set; } = "zh-CN";

    /// <summary>
    /// 作品状态。
    /// </summary>
    public WorkStatus Status { get; set; } = WorkStatus.Draft;

    /// <summary>
    /// 可见性。
    /// </summary>
    public WorkVisibility Visibility { get; set; } = WorkVisibility.Private;

    /// <summary>
    /// 审核状态。
    /// </summary>
    public ModerationStatus ModerationStatus { get; set; } = ModerationStatus.NotSubmitted;

    /// <summary>
    /// 创作模式。
    /// </summary>
    public WorkCreationMode CreationMode { get; set; } = WorkCreationMode.AiAssisted;

    /// <summary>
    /// 内容分级。
    /// </summary>
    public WorkContentRating ContentRating { get; set; } = WorkContentRating.General;

    /// <summary>
    /// 是否作为模板。
    /// </summary>
    public bool IsTemplate { get; set; }

    /// <summary>
    /// 来源作品ID。用于 fork / remix / 模板创建。
    /// </summary>
    [MaxLength(64)]
    public string? SourceWorkId { get; set; }

    /// <summary>
    /// 发布时间。
    /// </summary>
    public DateTime? PublishedAt { get; set; }

    /// <summary>
    /// 归档时间。
    /// </summary>
    public DateTime? ArchivedAt { get; set; }
}
