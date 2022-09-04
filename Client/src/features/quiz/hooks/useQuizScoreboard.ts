import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from '../../../utils/api/signalr/Socket';
import { PlayerRuntime, quizSplitApi } from '../api/quizAPI';

enum ScoreboardEvents {
    UpdateScoreboard = 'UpdateScoreboard',
}

export function UseQuizScoreboard(gameId: string): void {
    const dispatch = useAppDispatch();

    // Just send updates object
    useEffect(() => {
        connection.on(
            ScoreboardEvents.UpdateScoreboard,
            (player: PlayerRuntime) => {
                dispatch(
                    quizSplitApi.util.updateQueryData(
                        'quizGetGameScoreboard',
                        { gameId: gameId },
                        (draft) => {
                            const pl = draft.players?.findIndex(
                                (p) => p.id == player.id
                            );
                            if (!pl) {
                                draft.players?.push(player);
                            } else {
                                draft.players[pl] = player;
                            }
                        }
                    )
                );
            }
        );
    });
}
