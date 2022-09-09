import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from '../../../utils/api/signalr/Socket';
import { quizSplitApi } from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export function useTimer(gameId: string): void {
    const dispatch = useAppDispatch();
    useEffect(() => {
        connection.on(
            WebsocketEvents.PlayerStatusChange,
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
