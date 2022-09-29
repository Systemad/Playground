import { useEffect, useState } from 'react';

import { hubConnection } from '../../../utils/api/signalr/Socket';
import { WebsocketEvents } from '../Events';

export const useCorrectAnswer = () => {
    const [correctAnswer, setCorrectAnswer] = useState<string | undefined>();
    useEffect(() => {
        hubConnection.on(
            WebsocketEvents.CorrectAnswer,
            (correctAnswer: string) => {
                setCorrectAnswer(correctAnswer);
            }
        );
    });
    useEffect(() => {
        hubConnection.on(WebsocketEvents.NextQuestion, () => {
            setCorrectAnswer(undefined);
        });
    });
    return correctAnswer;
};
