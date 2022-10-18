import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';

export const useCorrectAnswer = () => {
    const [correctAnswer, setCorrectAnswer] = useState<string | undefined>();
    const connection = useContext(socketctx);
    useEffect(() => {
        const setCorrectAnswerListener = (correctAnswer: string) => {
            setCorrectAnswer(correctAnswer);
        };
        connection?.on('correct-answer', setCorrectAnswerListener);

        return () => {
            connection?.off('correct-answer', setCorrectAnswerListener);
        };
    }, [connection]);
    useEffect(() => {
        const finishQuestionListener = () => {
            setCorrectAnswer(undefined);
        };
        connection?.on('finish-question', finishQuestionListener);
    }, [connection]);
    return correctAnswer;
};
