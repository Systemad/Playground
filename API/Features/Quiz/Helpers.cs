using API.Features.Quiz.API;
using API.Features.Quiz.Models;

namespace API.Features.Quiz;

public class ProcessedQuestion
{
    public string category { get; set; }
    public string type { get; set; }
    public string difficulty { get; set; }
    public string question { get; set; }
    public List<string> answers { get; set; }
}

public static class Helpers
{
    public static ProcessedQuestion ProcessQuestion(this Result question)
    {
        var rnd = new Random();
        var news = new List<string>();
        news.AddRange(question.incorrect_answers);
        news.Add(question.correct_answer);
        var shuffle = news.OrderBy(item => rnd.Next()).ToList();
        var newq = new ProcessedQuestion
        {
            category = question.category,
            type = question.type,
            difficulty = question.difficulty,
            question = question.question,
            answers = shuffle
        };
        return newq;
    }
}