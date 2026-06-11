using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品标签关联实体。
/// </summary>
public class WorkTag : AggregateRoot<string>
{
    /// <summary>
    /// 作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkId { get; set; } = string.Empty;

    /// <summary>
    /// 标签ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string TagId { get; set; } = string.Empty;

    /// <summary>
    /// 标签来源。
    /// </summary>
    public TagSource Source { get; set; } = TagSource.User;

    /// <summary>
    /// AI 标签置信度。手动标签可为空。
    /// </summary>
    public decimal? Confidence { get; set; }
}
