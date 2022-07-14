namespace API.Features.Quiz.API;

public class QuizClient : IQuizClient
{
    public IEnumerable<Root>? QuizResponses { get; set; }

    private readonly IQuizPostApi _quizPostApi;
    
    public QuizClient(IQuizPostApi quizPostApi)
    {
        _quizPostApi = quizPostApi;
    }

    public async Task<Dictionary<int, Root>> GetQuizzes(QuizPost quizPost)
    {
        var apiKey = "grabapikeyfrom config";
        quizPost.ApiKey = apiKey;
        var post = await _quizPostApi.GetQuestions(quizPost);
        Dictionary<int, Root> _questions = 
            post.ToDictionary(question => question.id, question => question);

        return _questions;
    }
}