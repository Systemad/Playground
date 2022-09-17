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
                const patch = dispatch(
                    quizSplitApi.util.updateQueryData(
                        'quizGetGameScoreboard',
                        { gameId: gameId },
                        (draft) => {
                            const pl = draft?.findIndex(
                                (p) => p.id == playerId
                            );
                            if (!pl) draft[pl].ready = status;
                        }
                    )
                );
            }
        );
    });
}
