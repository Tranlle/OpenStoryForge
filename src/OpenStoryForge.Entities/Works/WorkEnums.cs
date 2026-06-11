namespace OpenStoryForge.Entities;

public enum WorkStatus
{
    Draft = 0,
    Generating = 1,
    Editing = 2,
    InReview = 3,
    Published = 4,
    Archived = 5
}

public enum WorkVisibility
{
    Private = 0,
    Team = 1,
    Unlisted = 2,
    Public = 3
}

public enum ModerationStatus
{
    NotSubmitted = 0,
    Pending = 1,
    Approved = 2,
    Rejected = 3,
    NeedsRevision = 4
}

public enum WorkCreationMode
{
    Human = 0,
    AiAssisted = 1,
    AiGenerated = 2,
    Mixed = 3
}

public enum WorkContentRating
{
    General = 0,
    Teen = 1,
    Mature = 2,
    Restricted = 3
}

public enum WorkVersionStatus
{
    Draft = 0,
    Frozen = 1,
    Published = 2,
    Deprecated = 3
}

public enum WorkAssetType
{
    Cover = 0,
    Hero = 1,
    CharacterSprite = 2,
    Background = 3,
    Cg = 4,
    Bgm = 5,
    Sfx = 6,
    Voice = 7,
    Thumbnail = 8,
    ScriptSnapshot = 9,
    BuildPackage = 10
}

public enum WorkAssetSource
{
    Uploaded = 0,
    AiGenerated = 1,
    Imported = 2,
    System = 3
}

public enum ContributorRole
{
    Owner = 0,
    Writer = 1,
    Artist = 2,
    Director = 3,
    VoiceActor = 4,
    Musician = 5,
    Editor = 6,
    AiAssistant = 7,
    Collaborator = 8
}

public enum TagCategory
{
    Genre = 0,
    Theme = 1,
    ArtStyle = 2,
    Gameplay = 3,
    Character = 4,
    ContentWarning = 5,
    System = 6
}

public enum TagSource
{
    User = 0,
    Ai = 1,
    Moderator = 2,
    System = 3
}

public enum WorkRelationType
{
    Sequel = 0,
    Prequel = 1,
    SpinOff = 2,
    Remake = 3,
    Remaster = 4,
    Translation = 5,
    SameUniverse = 6,
    TemplateSource = 7,
    Fork = 8
}

public enum WorkReleaseType
{
    Web = 0,
    Windows = 1,
    MacOS = 2,
    Linux = 3,
    Android = 4,
    Ios = 5
}

public enum WorkReleaseStatus
{
    Draft = 0,
    Building = 1,
    Ready = 2,
    Released = 3,
    Failed = 4,
    Deprecated = 5
}
