using API.Features.Quiz.Models;

namespace API.Features.Quiz.API;

public class OpenTdbClient : IOpenTdbClient
{
    public List<Root>? QuizResponses { get; set; }

    private readonly HttpClient _httpClient;
    
    public OpenTdbClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<Result>> GetQuestions(Settings model)
    {
        string postString;
        var post = new OpenDtbModel
        {
            Amount = model.Questions,
            Category = model.Category,
            Difficulty = model.Difficulty
        };
        if(model.Category == "0" && model.Difficulty == "any") {
            postString = $"https://opentdb.com/api.php?amount=${model.Questions}&encode=url3986";
        } else if(model.Category == "0") {
            postString = $"https://opentdb.com/api.php?amount=${model.Questions}&difficulty=${model.Difficulty}&encode=url3986";
        } else if(model.Difficulty == "any") {
            postString = $"https://opentdb.com/api.php?amount=${model.Questions}&category=${model.Category}&encode=url3986";
        } else {
            postString = $"https://opentdb.com/api.php?amount=${model.Questions}&category=${model.Category}&difficulty=${model.Difficulty}&encode=url3986";
        };
        var response = await _httpClient.GetFromJsonAsync<Root>(postString);
        return response.results;
    }
}


public interface IOpenTdbClient
{
    Task<List<Result>> GetQuestions(Settings model);
}
