using Refit;

namespace API.Features.Quiz.API;

public interface IQuizPostApi
{
    [Post("/api/v1/questions")]
    Task<IEnumerable<Root>> GetQuestions([Body(BodySerializationMethod.UrlEncoded)] QuizPost quizPost);
}

// https://quizapi.io/api/v1/questions?apiKey={APIKey}&limit={amount}&category={category}&difficulty={difficulty};
public class QuizPost
{
    [AliasAs("apiKey")]
    public string ApiKey { get; set; }
    
    [AliasAs("limit")]
    public int Limit { get; set; }

    [AliasAs("category")]
    public Category Category { get; set; }
    
    [AliasAs("difficulty")]
    public Difficulty Difficulty { get; set; }
}

public class Root
{
    public int id { get; set; }
    public string question { get; set; }
    public string description { get; set; }
    public Answers answers { get; set; }
    public string multiple_correct_answers { get; set; }
    public Correct_Answers correct_answers { get; set; }
    public string explanation { get; set; }
    public object tip { get; set; }
    public object[] tags { get; set; }
    public string category { get; set; }
    public string difficulty { get; set; }
}

public class Answers
{
    public string answer_a { get; set; }
    public string answer_b { get; set; }
    public string answer_c { get; set; }
    public string answer_d { get; set; }
    public object answer_e { get; set; }
    public object answer_f { get; set; }
}

public class Correct_Answers
{
    public string answer_a_correct { get; set; }
    public string answer_b_correct { get; set; }
    public string answer_c_correct { get; set; }
    public string answer_d_correct { get; set; }
    public string answer_e_correct { get; set; }
    public string answer_f_correct { get; set; }
}