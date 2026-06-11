using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品统计实体。
/// 高频更新字段独立成表，避免频繁修改作品主表。
/// </summary>
public class WorkStats : AggregateRoot<string>
{
    /// <summary>
    /// 所属作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkId { get; set; } = string.Empty;

    /// <summary>
    /// 浏览次数。
    /// </summary>
    public long ViewCount { get; set; }

    /// <summary>
    /// 游玩次数。
    /// </summary>
    public long PlayCount { get; set; }

    /// <summary>
    /// 点赞数。
    /// </summary>
    public long LikeCount { get; set; }

    /// <summary>
    /// 收藏数。
    /// </summary>
    public long FavoriteCount { get; set; }

    /// <summary>
    /// 评论数。
    /// </summary>
    public long CommentCount { get; set; }

    /// <summary>
    /// 评分人数。
    /// </summary>
    public int RatingCount { get; set; }

    /// <summary>
    /// 平均评分。
    /// </summary>
    public decimal? RatingAverage { get; set; }
}
