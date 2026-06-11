using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品关系实体。
/// 用于续作、前传、重制、翻译、同世界观、Fork 等。
/// </summary>
public class WorkRelation : AggregateRoot<string>
{
    /// <summary>
    /// 源作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string SourceWorkId { get; set; } = string.Empty;

    /// <summary>
    /// 目标作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string TargetWorkId { get; set; } = string.Empty;

    /// <summary>
    /// 关系类型。
    /// </summary>
    public WorkRelationType RelationType { get; set; }

    /// <summary>
    /// 是否官方关系。
    /// </summary>
    public bool IsOfficial { get; set; } = true;
}
