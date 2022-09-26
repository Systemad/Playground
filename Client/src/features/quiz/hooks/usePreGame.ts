import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from '../../../utils/api/signalr/Socket';
import { quizSplitApi } from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export function usePreGame(gameId: string): void {
    const dispatch = useAppDispatch();
    useEffect(() => {
        connection.on(
            WebsocketEvents.ChangePlayerStatus,
            (playerId: string, status: boolean) => {
                dispatch(
                    quizSplitApi.util.updateQueryData(
                        'quizGetGameRuntime',
                        { gameId: gameId },
                        (draft) => {
                            const pl = draft?.scoreboard?.find(
                                (p) => p.id === playerId
                            );

                            if (pl) {
                                pl.ready = status;
                            }
                        }
                    )
                );
            }
        );
    });
}
