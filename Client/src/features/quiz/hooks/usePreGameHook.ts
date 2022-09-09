import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from '../../../utils/api/signalr/Socket';
import { quizSplitApi } from '../api/quizAPI';

enum ScoreboardEvents {
    PlayerStatusChange = 'PlayerStatusChange',
}

export function usePreGameHook(gameId: string): void {
    const dispatch = useAppDispatch();
    useEffect(() => {
        connection.on(
            ScoreboardEvents.PlayerStatusChange,
            (playerId: string, status: boolean) => {
                dispatch(
                    quizSplitApi.util.updateQueryData(
                        'quizGetGameScoreboard',
                        { gameId: gameId },
                        (draft) => {
                            const pl = draft.players?.findIndex(
                                (p) => p.id == playerId
                            );
                            if (!pl) draft.players[pl].ready = status;
                        }
                    )
                );
            }
        );
    });
}
