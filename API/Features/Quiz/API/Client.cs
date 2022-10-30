using API.Features.Quiz.Models;

namespace API.Features.Quiz.API;

public class OpenTdbClient : IOpenTdbClient
{
    private readonly HttpClient _httpClient;

    public OpenTdbClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<Result>> GetQuestions(QuizSettings model)
    {
        string postString;
        if (model.Category == "999" && model.Difficulty == "random")
            postString = $"https://opentdb.com/api.php?amount={model.Questions}&type=multiple";
        else if (model.Category == "999")
            postString =
                $"https://opentdb.com/api.php?amount={model.Questions}&difficulty={model.Difficulty}&type=multiple";
        else if (model.Difficulty == "any")
            postString =
                $"https://opentdb.com/api.php?amount={model.Questions}&category={model.Category}&type=multiple";
        else
            postString =
                $"https://opentdb.com/api.php?amount={model.Questions}&type=multiple";

        var response = await _httpClient.GetFromJsonAsync<Root>(postString);
        return response.results;
    }
}

public interface IOpenTdbClient
{
    Task<List<Result>> GetQuestions(QuizSettings model);
}