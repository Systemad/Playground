namespace API.Features.Quiz.API;

public class OpenDtbModel
{
    public int Amount { get; set; }
    public string Category { get; set; }
    public string Difficulty { get; set; }
    public string Type { get; set; }
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