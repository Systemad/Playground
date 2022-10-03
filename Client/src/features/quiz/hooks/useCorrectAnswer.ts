import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { WebsocketEvents } from '../Events';

export const useCorrectAnswer = () => {
    const [correctAnswer, setCorrectAnswer] = useState<string | undefined>();
    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on(WebsocketEvents.CorrectAnswer, (correctAnswer: string) => {
            setCorrectAnswer(correctAnswer);
        });
    });
    useEffect(() => {
        socket.on(WebsocketEvents.NextQuestion, () => {
            setCorrectAnswer(undefined);
        });
    });
    return correctAnswer;
};
