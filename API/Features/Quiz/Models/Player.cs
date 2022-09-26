﻿namespace API.Features.Quiz.Models;

public class PlayerData
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}

public class PlayerState
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
    public bool Answered { get; set; } = false;
    public bool? AnsweredCorrectly { get; set; }
    public bool Ready { get; set; } = false;
}

public class PlayerResult
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
}