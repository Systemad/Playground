import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { WebsocketEvents } from '../Events';

export const useCorrectAnswer = () => {
    const [correctAnswer, setCorrectAnswer] = useState<string | undefined>();
    const connection = useContext(socketctx);
    useEffect(() => {
        const setCorrectAnswerListener = (correctAnswer: string) => {
            setCorrectAnswer(correctAnswer);
        };
        connection?.on(WebsocketEvents.CorrectAnswer, setCorrectAnswerListener);

        return () => {
            connection?.off(
                WebsocketEvents.CorrectAnswer,
                setCorrectAnswerListener
            );
        };
    }, [connection]);
    useEffect(() => {
        const resetCorrectAnswerListener = () => {
            setCorrectAnswer(undefined);
        };
        connection?.on(
            WebsocketEvents.NextQuestion,
            resetCorrectAnswerListener
        );
    }, [connection]);
    return correctAnswer;
};
