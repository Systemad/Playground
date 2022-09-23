import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from '../../../utils/api/signalr/Socket';
import { PlayerRuntime, quizSplitApi, Scoreboard } from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export function UseQuizScoreboard(gameId: string): void {
    const dispatch = useAppDispatch();

    useEffect(() => {
        connection.on(
            WebsocketEvents.UpdateScoreboard,
            (scoreboard: Scoreboard) => {
                dispatch(
                    quizSplitApi.util.updateQueryData(
                        'quizGetGameRuntime',
                        { gameId: gameId },
                        (draft) => {
                            draft.scoreboard = scoreboard;
                        }
                    )
                );
            }
        );

        connection.on(WebsocketEvents.PlayerAnswered, (player: string) => {
            dispatch(
                quizSplitApi.util.updateQueryData(
                    'quizGetGameRuntime',
                    { gameId: gameId },
                    (draft) => {
                        const pl = draft?.scoreboard?.players?.find(
                            (p) => p.id === player
                        );
                        if (pl) pl.answered = true;
                    }
                )
            );
        });
    });
}
