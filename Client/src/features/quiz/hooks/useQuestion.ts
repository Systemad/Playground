import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { ProcessedQuestion } from '../api/quizAPI';

export const useQuestion = () => {
    const [currentQuestion, setCurrentQuestion] = useState<
        ProcessedQuestion | undefined
    >();
    const connection = useContext(socketctx);
    useEffect(() => {
        const newQuestion = (question: ProcessedQuestion) => {
            console.log('useQuestion: new qustion');
            setCurrentQuestion(question);
        };

        connection?.on('new-question', newQuestion);
        return () => {
            connection?.off('new-question', newQuestion);
        };
    }, [connection]);

    useEffect(() => {
        const resetQustion = () => {
            console.log('useQuestion: finish-qeustion');
            setCurrentQuestion(undefined);
        };
        connection?.on('finish-question', resetQustion);
        return () => {
            connection?.off('finish-question', resetQustion);
        };
    }, [connection]);

    return currentQuestion;
};
