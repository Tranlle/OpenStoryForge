using System.ComponentModel.DataAnnotations;

namespace OpenStoryForge.Entities;

/// <summary>
/// 标签实体。
/// </summary>
public class Tag : AggregateRoot<string>
{
    /// <summary>
    /// 标签名称。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 标签 Slug。
    /// </summary>
    [Required]
    [MaxLength(80)]
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// 标签分类。
    /// </summary>
    public TagCategory Category { get; set; } = TagCategory.Genre;

    /// <summary>
    /// 是否为系统标签。
    /// </summary>
    public bool IsSystem { get; set; }

    /// <summary>
    /// 标签描述。
    /// </summary>
    [MaxLength(500)]
    public string? Description { get; set; }
}
