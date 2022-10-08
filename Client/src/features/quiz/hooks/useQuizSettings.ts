import { useContext, useEffect, useState } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';
import { QuizRuntime } from '../api/quizAPI';

export const useQuizRuntime = () => {
    const [settings, setCurrentSettings] = useState<QuizRuntime>();
    const hubConnection = useHubConnection();
    useEffect(() => {
        const setQuizSettings = (question: QuizRuntime) => {
            setCurrentSettings(question);
        };

        hubConnection?.on('quiz-runtime', setQuizSettings);
    }, [hubConnection]);

    return settings;
};
