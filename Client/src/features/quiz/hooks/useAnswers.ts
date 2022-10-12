import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';

export const useAnswers = () => {
    const [answers, setAnswers] = useState<string[]>();
    const connection = useContext(socketctx);
    useEffect(() => {
        const setAnswer = (answers: string[]) => {
            setAnswers(answers);
        };
        connection?.on('new-question', setAnswer);

        return () => {
            connection?.off('new-question', setAnswer);
        };
    }, [connection]);

    useEffect(() => {
        const setAnswer = () => setAnswers([]);

        connection?.on('finish-question', setAnswer);

        return () => {
            connection?.off('finish-question', setAnswer);
        };
    }, [connection]);

    return answers;
};
