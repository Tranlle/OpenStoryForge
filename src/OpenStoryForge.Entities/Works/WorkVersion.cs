using System.ComponentModel.DataAnnotations;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品版本实体。
/// 用于保存草稿、冻结版、发布版、历史版本。
/// </summary>
public class WorkVersion : AggregateRoot<string>
{
    /// <summary>
    /// 所属作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkId { get; set; } = string.Empty;

    /// <summary>
    /// 版本号，从 1 开始递增。
    /// </summary>
    public int VersionNumber { get; set; }

    /// <summary>
    /// 版本名称，例如 v1、首发版、重写版。
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 版本状态。
    /// </summary>
    public WorkVersionStatus Status { get; set; } = WorkVersionStatus.Draft;

    /// <summary>
    /// 版本变更说明。
    /// </summary>
    public string? Changelog { get; set; }

    /// <summary>
    /// 创建该版本的用户ID。
    /// </summary>
    public Guid CreatedByUserId { get; set; }

    /// <summary>
    /// 快照素材ID，可指向剧本/节点图快照文件。
    /// </summary>
    [MaxLength(64)]
    public string? SnapshotAssetId { get; set; }

    /// <summary>
    /// 冻结时间。冻结后的版本可用于发布、构建、回滚。
    /// </summary>
    public DateTime? FrozenAt { get; set; }

    /// <summary>
    /// 发布时间。
    /// </summary>
    public DateTime? PublishedAt { get; set; }
}
