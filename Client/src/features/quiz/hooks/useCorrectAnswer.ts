import { useEffect, useState } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';
import { WebsocketEvents } from '../Events';

export const useCorrectAnswer = () => {
    const [correctAnswer, setCorrectAnswer] = useState<string | undefined>();
    const hubConnection = useHubConnection();
    useEffect(() => {
        hubConnection?.on(
            WebsocketEvents.CorrectAnswer,
            (correctAnswer: string) => {
                setCorrectAnswer(correctAnswer);
            }
        );
    }, [hubConnection]);
    useEffect(() => {
        hubConnection?.on(WebsocketEvents.NextQuestion, () => {
            setCorrectAnswer(undefined);
        });
    }, [hubConnection]);
    return correctAnswer;
};
