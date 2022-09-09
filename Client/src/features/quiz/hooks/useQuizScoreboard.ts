import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from '../../../utils/api/signalr/Socket';
import { PlayerRuntime, quizSplitApi } from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export function UseQuizScoreboard(gameId: string): void {
    const dispatch = useAppDispatch();

    useEffect(() => {
        connection.on(
            WebsocketEvents.UpdateScoreboard,
            (players: PlayerRuntime[]) => {
                dispatch(
                    quizSplitApi.util.updateQueryData(
                        'quizGetGameScoreboard',
                        { gameId: gameId },
                        (draft) => {
                            draft.players = players;
                        }
                    )
                );
            }
        );
    });
}
