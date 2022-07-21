namespace API.Features.Quiz.API;

public class QuizClient : IQuizClient
{
    public IEnumerable<Root>? QuizResponses { get; set; }

    private readonly IQuizPostApi _quizPostApi;
    
    public QuizClient(IQuizPostApi quizPostApi)
    {
        _quizPostApi = quizPostApi;
    }

    public async Task<Root[]> GetQuizzes(QuizPost quizPost)
    {
        var apiKey = "grabapikeyfrom config";
        quizPost.ApiKey = apiKey;
        var question = await _quizPostApi.GetQuestions(quizPost);
        return question;
    }
}