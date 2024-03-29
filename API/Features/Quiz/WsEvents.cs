﻿namespace API.Features.Quiz;

public static class WsEvents
{
    public const string NewGame = "new-game";
    public const string StartGame = "start-game";
    public const string StopGame = "stop-game";
    public const string GameFinished = "game-finished";
    public const string GameReset = "game-reset";
    public const string UsersReady = "all-users-ready";

    public const string CorrectAnswer = "correct-answer";
    public const string NewQuestion = "new-question";
    public const string FinishQuestion = "finish-question";
    public const string LobbyPlayers = "lobby-players";

    public const string UpdateStatus = "update-status";
    public const string UpdateScoreboard = "update-scoreboard";
    public const string TimerUpdate = "timer-update";
    public const string GameUpdated = "update-game";
}