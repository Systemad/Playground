import { useEffect, useState } from 'react';

import connection from '../../../utils/api/signalr/Socket';
import { WebsocketEvents } from '../Events';

export const useCorrectAnswer = () => {
    const [correctAnswer, setCorrectAnswer] = useState<string | undefined>();
    useEffect(() => {
        connection.on(
            WebsocketEvents.CorrectAnswer,
            (correctAnswer: string) => {
                setCorrectAnswer(correctAnswer);
            }
        );
    });
    useEffect(() => {
        connection.on(WebsocketEvents.NextQuestion, (correctAnswer: string) => {
            setCorrectAnswer(undefined);
        });
    });
    return correctAnswer;
};
