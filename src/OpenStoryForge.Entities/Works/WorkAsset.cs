using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品素材实体。
/// 用于封面、头图、背景、立绘、CG、音乐、音效、语音、构建包等。
/// </summary>
public class WorkAsset : AggregateRoot<string>
{
    /// <summary>
    /// 所属作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkId { get; set; } = string.Empty;

    /// <summary>
    /// 素材类型。
    /// </summary>
    public WorkAssetType AssetType { get; set; }

    /// <summary>
    /// 素材角色，例如 cover、hero、main、thumbnail、chapter-preview。
    /// </summary>
    [MaxLength(64)]
    public string? Role { get; set; }

    /// <summary>
    /// 存储键。建议存对象存储 key，不直接存完整 CDN URL。
    /// </summary>
    [Required]
    [MaxLength(1024)]
    public string StorageKey { get; set; } = string.Empty;

    /// <summary>
    /// 原始文件名。
    /// </summary>
    [MaxLength(255)]
    public string? OriginalFileName { get; set; }

    /// <summary>
    /// MIME 类型。
    /// </summary>
    [MaxLength(100)]
    public string? MimeType { get; set; }

    /// <summary>
    /// 文件大小，单位 byte。
    /// </summary>
    public long SizeBytes { get; set; }

    /// <summary>
    /// 图片宽度。
    /// </summary>
    public int? Width { get; set; }

    /// <summary>
    /// 图片高度。
    /// </summary>
    public int? Height { get; set; }

    /// <summary>
    /// 音频/视频时长，单位毫秒。
    /// </summary>
    public int? DurationMs { get; set; }

    /// <summary>
    /// 素材来源。
    /// </summary>
    public WorkAssetSource Source { get; set; } = WorkAssetSource.Uploaded;

    /// <summary>
    /// 生成该素材的 AI 任务ID。
    /// </summary>
    [MaxLength(64)]
    public string? GeneratedByAiJobId { get; set; }

    /// <summary>
    /// 内容哈希，用于去重、缓存、完整性校验。
    /// </summary>
    [MaxLength(128)]
    public string? ContentHash { get; set; }

    /// <summary>
    /// 元数据 JSON。可放模型参数、裁剪信息、额外尺寸等。
    /// </summary>
    public string? MetadataJson { get; set; }
}
