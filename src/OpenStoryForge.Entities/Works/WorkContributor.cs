using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品贡献者实体。
/// </summary>
public class WorkContributor : AggregateRoot<string>
{
    /// <summary>
    /// 所属作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkId { get; set; } = string.Empty;

    /// <summary>
    /// 平台用户ID。外部贡献者可以为空。
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// 展示名称。
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string DisplayName { get; set; } = string.Empty;

    /// <summary>
    /// 贡献角色。
    /// </summary>
    public ContributorRole Role { get; set; }

    /// <summary>
    /// 排序值。
    /// </summary>
    public int SortOrder { get; set; }
}
