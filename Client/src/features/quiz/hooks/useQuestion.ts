import { useContext, useEffect, useState } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';
import { ProcessedQuestion } from '../api/quizAPI';

export const useQuestion = () => {
    const [currentQuestion, setCurrentQuestion] = useState<
        ProcessedQuestion | undefined
    >();
    const hubConnection = useHubConnection();
    useEffect(() => {
        const newQuestion = (question: ProcessedQuestion) => {
            console.log('nequestionrecived');
            setCurrentQuestion(question);
        };

        hubConnection?.on('new-question', newQuestion);
        return () => {
            hubConnection?.off('new-question', newQuestion);
        };
    }, [hubConnection]);

    useEffect(() => {
        const resetQustion = () => setCurrentQuestion(undefined);
        hubConnection?.on('finish-question', resetQustion);
        return () => {
            hubConnection?.off('finish-question', resetQustion);
        };
    }, [hubConnection]);

    return currentQuestion;
};
