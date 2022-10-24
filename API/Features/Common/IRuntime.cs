namespace API.Features.Common;

public interface IRuntime
{
    public Guid OwnerId { get; set; }
    public Guid GameId { get; set; }
    public GameStatus Status { get; set; }
}