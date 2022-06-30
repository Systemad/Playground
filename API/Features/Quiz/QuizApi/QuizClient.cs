namespace API.Features.Quiz.QuizApi;

public class QuizClient
{
    public IEnumerable<Root>? QuizResponses { get; set; }

    private readonly IQuizPostApi _quizPostApi;
    
    public QuizClient(IQuizPostApi quizPostApi)
    {
        _quizPostApi = quizPostApi;

    }

    public async Task<IEnumerable<Root>?> GetQuizzes(Category category, Difficulty difficulty, int amount)
    {
        var apiKey = "grabapikeyfrom config";
        var quizArguments = new QuizPost
        {
            ApiKey = apiKey,
            Limit = amount,
            Category = category,
            Difficulty = difficulty
        };
        
        var post = await _quizPostApi.GetQuestions(quizArguments);
        
        return post.
    }
}