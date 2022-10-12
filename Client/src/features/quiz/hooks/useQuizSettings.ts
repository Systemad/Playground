import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { QuizRuntime } from '../api/quizAPI';

export const useQuizRuntime = () => {
    const [settings, setCurrentSettings] = useState<QuizRuntime>();
    const connection = useContext(socketctx);
    useEffect(() => {
        const setQuizSettings = (question: QuizRuntime) => {
            console.log('quizruntime');
            setCurrentSettings(question);
        };

        connection?.on('quiz-runtime', setQuizSettings);
        return () => {
            connection?.off('quiz-runtime', setQuizSettings);
        };
    }, [connection]);

    return settings;
};
