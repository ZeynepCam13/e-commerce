namespace API.Services;

public class AiConversationMemory
{

    private static readonly Dictionary<string, string> _lastCategoryByUser = new();

    public void SetLastCategory(string userKey, string category)
    {
        _lastCategoryByUser[userKey] = category;
    }

    public string? GetLastCategory(string userKey)
    {
        return _lastCategoryByUser.TryGetValue(userKey, out var cat) ? cat : null;
    }
}
