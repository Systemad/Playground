import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { ProcessedQuestion } from '../api/quizAPI';

export const useQuestion = () => {
    const [currentQuestion, setCurrentQuestion] = useState<
        ProcessedQuestion | undefined
    >();
    const socket = useContext(SocketContext);
    useEffect(() => {
        const newQuestion = (question: ProcessedQuestion) =>
            setCurrentQuestion(question);
        socket.on('new-question', newQuestion);
        return () => {
            socket.off('new-question', newQuestion);
        };
    }, [socket]);

    useEffect(() => {
        const resetQustion = () => setCurrentQuestion(undefined);
        socket.on('finish-question', resetQustion);
        return () => {
            socket.off('finish-question', resetQustion);
        };
    }, [socket]);

    return currentQuestion;
};
