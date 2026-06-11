using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenStoryForge.Entities;

/// <summary>
/// 作品 AI 创作配置实体。
/// </summary>
public class WorkAiProfile : AggregateRoot<string>
{
    /// <summary>
    /// 所属作品ID。
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string WorkId { get; set; } = string.Empty;

    /// <summary>
    /// 默认文本模型。
    /// </summary>
    [MaxLength(100)]
    public string? DefaultTextModel { get; set; }

    /// <summary>
    /// 默认图像模型。
    /// </summary>
    [MaxLength(100)]
    public string? DefaultImageModel { get; set; }

    /// <summary>
    /// 默认语音模型。
    /// </summary>
    [MaxLength(100)]
    public string? DefaultVoiceModel { get; set; }

    /// <summary>
    /// 写作风格提示词。
    /// </summary>
    public string? WritingStylePrompt { get; set; }

    /// <summary>
    /// 美术风格提示词。
    /// </summary>
    public string? ArtStylePrompt { get; set; }

    /// <summary>
    /// 负面提示词。
    /// </summary>
    public string? NegativePrompt { get; set; }

    /// <summary>
    /// 生成策略 JSON。
    /// </summary>
    [Required]
    public string GenerationPolicyJson { get; set; } = "{}";

    /// <summary>
    /// 安全策略 JSON。
    /// </summary>
    [Required]
    public string SafetyPolicyJson { get; set; } = "{}";
}
