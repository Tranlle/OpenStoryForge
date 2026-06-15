namespace OpenStoryForge.Configuration;

public class DatabaseOptions
{
    public const string SectionName = "Database";

    public string Provider { get; set; } = "Sqlite";

    public string ConnectionString { get; set; } = string.Empty;
}
