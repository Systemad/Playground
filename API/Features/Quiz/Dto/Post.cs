using API.Features.Quiz.API;
using API.Features.Quiz.Models;

namespace API.Features.Quiz.Dto;

public class QuizCreationModel
{
    public string Name { get; set; }
    public int Questions { get; set; }
    public string Category { get; set; }
    public string Difficulty { get; set; }
    public string Type { get; set; }
}

public static class QuizCreationMapper
{
    public static Settings ToSettingsState(this QuizCreationModel settingsModel)
    {
        var newobj = new Settings
        {
            Name = settingsModel.Name,
            Type = settingsModel.Type,
            Category = settingsModel.Category,
            Difficulty = settingsModel.Difficulty,
            Questions = settingsModel.Questions
        };
        return newobj;
    }

    public static OpenDtbModel ToCreationModel(Settings settingState)
    {
        var newobj = new OpenDtbModel
        {
            Amount = settingState.Questions,
            Category = settingState.Category,
            Difficulty = settingState.Difficulty,
            Type = settingState.Type
        };
        return newobj;
    }
}