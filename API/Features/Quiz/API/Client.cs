using API.Features.Quiz.Models;

namespace API.Features.Quiz.API;

public class OpenTdbClient : IOpenTdbClient
{
    private readonly HttpClient _httpClient;

    public OpenTdbClient()
    {
        _httpClient = new HttpClient();
    }

    public async Task<List<Result>> GetQuestions(QuizSettings model)
    {
        string postString;
        if (model.Category == "0" && model.Difficulty == "any")
            postString = $"https://opentdb.com/api.php?amount={model.Questions}";
        else if (model.Category == "0")
            postString =
                $"https://opentdb.com/api.php?amount={model.Questions}&difficulty={model.Difficulty}";
        else if (model.Difficulty == "any")
            postString =
                $"https://opentdb.com/api.php?amount={model.Questions}&category={model.Category}";
        else
            postString =
                $"https://opentdb.com/api.php?amount={model.Questions}";
        ;
        var response = await _httpClient.GetFromJsonAsync<Root>(postString);
        return response.results;
    }
}

public interface IOpenTdbClient
{
    Task<List<Result>> GetQuestions(QuizSettings model);
}