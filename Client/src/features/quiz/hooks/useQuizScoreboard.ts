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
            (players: Scoreboard) => {
                const patch = dispatch(
                    quizSplitApi.util.updateQueryData(
                        'quizGetGameScoreboard',
                        { gameId: gameId },
                        (draft) => {
                            draft = players;
                        }
                    )
                );
            }
        );

        connection.on(WebsocketEvents.PlayerAnswered, (player: string) => {
            dispatch(
                quizSplitApi.util.updateQueryData(
                    'quizGetGameScoreboard',
                    { gameId: gameId },
                    (draft) => {
                        const pl = draft?.players?.findIndex(
                            (p) => p.id === player
                        );
                        if (draft.players && pl)
                            draft.players[pl].answered = true;
                    }
                )
            );
        });
    });
}
