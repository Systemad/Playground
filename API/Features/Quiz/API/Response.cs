using Refit;

namespace API.Features.Quiz.API;

public interface IQuizPostApi
{
    [Post("/api/v1/questions")]
    Task<Root> GetQuestions([Body(BodySerializationMethod.UrlEncoded)] QuizPost quizPost);
}

// https://quizapi.io/api/v1/questions?apiKey={APIKey}&limit={amount}&category={category}&difficulty={difficulty};
public class QuizPost
{
    [AliasAs("token")]
    public string Token { get; set; }
    
    [AliasAs("type")]
    public string Type { get; set; }
    
    [AliasAs("amount")]
    public int Amount { get; set; }

    [AliasAs("category")]
    public Category Category { get; set; }
    
    [AliasAs("difficulty")]
    public Difficulty Difficulty { get; set; }
}

public class QuizSettingsModel
{
    public string Name { get; set; }
    public int Limit { get; set; }
    public Category Category { get; set; }
    public Difficulty Difficulty { get; set; }
}

// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
public class Result
{
    public string category { get; set; }
    public string type { get; set; }
    public string difficulty { get; set; }
    public string question { get; set; }
    public string correct_answer { get; set; }
    public List<string> incorrect_answers { get; set; }
}

public class Root
{
    public int response_code { get; set; }
    public List<Result> results { get; set; }
}