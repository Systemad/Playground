﻿namespace API.Features.Common;

public class MultiplayerState
{
    public Guid GameId { get; set; }
    public Guid OwnerId { get; set; }
    public string Name { get; set; }
    public GameStatus GameStatus { get; set; } = GameStatus.AwaitingPlayers;
    public GameMode GameMode { get; set; }
}