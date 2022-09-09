import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from '../../../utils/api/signalr/Socket';
import { Player, quizSplitApi, Result } from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export function UseQuizSocket(gameId: string): void {
    const dispatch = useAppDispatch();

    useEffect(() => {
        connection.on(WebsocketEvents.PlayerAdded, (player: Player) => {
            dispatch(
                quizSplitApi.util.updateQueryData(
                    'quizGetGameRuntime',
                    { gameId: gameId },
                    (draft) => {
                        const newplayer = draft.players?.filter(
                            (p) => p.id == player.id
                        );
                        if (!newplayer) draft.players?.push(player);
                    }
                )
            );
        });

        connection.on(WebsocketEvents.PlayerRemoved, (playerId: string) => {
            dispatch(
                quizSplitApi.util.updateQueryData(
                    'quizGetGameRuntime',
                    { gameId: gameId },
                    (draft) => {
                        const player = draft.players?.filter(
                            (p) => p.id == playerId
                        );
                        if (draft.players && player)
                            draft.players.filter((p) => p.id == playerId);
                    }
                )
            );
        });
        connection.on(WebsocketEvents.StartGame, (question: Result) => {
            if (question) {
                quizSplitApi.util.updateQueryData(
                    'quizGetGameRuntime',
                    { gameId: gameId },
                    (draft) => {
                        draft.currentQuestion = question;
                        draft.gameActive = true;
                    }
                );
            }
        });

        connection.on(WebsocketEvents.StopGame, () => {
            quizSplitApi.util.updateQueryData(
                'quizGetGameRuntime',
                { gameId: gameId },
                (draft) => {
                    draft.gameActive = false;
                }
            );
        });
        connection.on(WebsocketEvents.NextQuestion, (question: Result) => {
            dispatch(
                quizSplitApi.util.updateQueryData(
                    'quizGetGameRuntime',
                    { gameId: gameId },
                    (draft) => {
                        if (draft.questionStep) draft.questionStep++;
                        draft.currentQuestion = question;
                    }
                )
            );
        });
    });
}
