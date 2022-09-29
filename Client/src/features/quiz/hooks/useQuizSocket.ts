import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import { hubConnection } from '../../../utils/api/signalr/Socket';
import {
    PlayerState,
    ProcessedQuestion,
    QuizRuntime,
    quizSplitApi,
} from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export function UseQuizSocket(gameId: string): void {
    const dispatch = useAppDispatch();

    useEffect(() => {
        hubConnection.on(
            WebsocketEvents.UpdateScoreboard,
            (scoreboard: PlayerState[]) => {
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

        hubConnection.on(WebsocketEvents.StartGame, (runtime: QuizRuntime) => {
            quizSplitApi.util.updateQueryData(
                'quizGetGameRuntime',
                { gameId: gameId },
                (draft) => {
                    draft = runtime;
                }
            );
        });

        hubConnection.on(WebsocketEvents.StopGame, () => {
            quizSplitApi.util.updateQueryData(
                'quizGetGameRuntime',
                { gameId: gameId },
                (draft) => {
                    draft.active = false;
                }
            );
        });
        hubConnection.on(
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
