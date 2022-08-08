namespace API.Features.Quiz.API;

public class QuizClient : IQuizClient
{
    public List<Root>? QuizResponses { get; set; }

    private readonly IQuizPostApi _quizPostApi;
    
    public QuizClient(IQuizPostApi quizPostApi)
    {
        _quizPostApi = quizPostApi;
    }

    public async Task<List<Result>> GetQuizzes(QuizSettingState quizPost)
    {
        var apiKey = "grabapikeyfrom config";

        var qPost = new QuizPost
        {
            Token = apiKey,
            Type = "multiple",
            Amount = quizPost.Questions,
            Category = quizPost.Category,
            Difficulty = quizPost.Difficulty
        };
        var question = await _quizPostApi.GetQuestions(qPost);
        return question.results;
    }
}