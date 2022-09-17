export enum WebsocketEvents {
    UpdateScoreboard = 'UpdateScoreboard',

    PlayerStatusChange = 'PlayerStatusChange',
    PlayerAdded = 'PlayerAdded',
    PlayerRemoved = 'PlayerRemoved',
    PlayerAnswered = 'PlayerAnswered',
    StartGame = 'StartGame',
    StopGame = 'StopGame',

    RoundResults = 'RoundResults',
    NextQuestion = 'NextQuestion',

    CorrectAnswer = 'CorrectAnswer',
}
