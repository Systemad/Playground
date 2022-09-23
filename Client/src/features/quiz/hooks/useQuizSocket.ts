import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import connection from '../../../utils/api/signalr/Socket';
import { ProcessedQuestion, quizSplitApi, Runtime } from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export function UseQuizSocket(gameId: string): void {
    const dispatch = useAppDispatch();

    useEffect(() => {
        connection.on(WebsocketEvents.StartGame, (runtime: Runtime) => {
            if (runtime) {
                quizSplitApi.util.updateQueryData(
                    'quizGetGameRuntime',
                    { gameId: gameId },
                    (draft) => {
                        draft = runtime;
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
        connection.on(
            WebsocketEvents.NextQuestion,
            (question: ProcessedQuestion) => {
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
            }
        );
    });
}
