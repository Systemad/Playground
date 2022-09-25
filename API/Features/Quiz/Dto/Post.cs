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
    public int Timeout { get; set; }
}

public static class QuizCreationMapper
{
    public static QuizSettings ToSettingsState(this QuizCreationModel settingsModel)
    {
        var newobj = new QuizSettings
        {
            Type = settingsModel.Type,
            Category = settingsModel.Category,
            Difficulty = settingsModel.Difficulty,
            Questions = settingsModel.Questions
        };
        return newobj;
    }

    public static OpenDtbModel ToCreationModel(QuizSettings quizSettingState)
    {
        var newobj = new OpenDtbModel
        {
            Amount = quizSettingState.Questions,
            Category = quizSettingState.Category,
            Difficulty = quizSettingState.Difficulty,
            Type = quizSettingState.Type
        };
        return newobj;
    }
}