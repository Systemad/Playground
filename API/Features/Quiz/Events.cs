namespace API.Features.Quiz;

public enum Events
{
    PlayerAdded,
    PlayerRemoved,
    
    StartGame,
    EndGame,
    
    RoundResults,
    NextQuestion,
    
    PlayerStatusChange,
}