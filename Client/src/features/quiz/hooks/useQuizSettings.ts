import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { QuizRuntime } from '../api/quizAPI';

export const useQuizSettings = () => {
    const [settings, currentSettings] = useState<QuizRuntime>();
    const socket = useContext(SocketContext);
    useEffect(() => {
        const setQuizSettings = (question: QuizRuntime) => {
            console.log('runtime');
            currentSettings(question);
        };

        socket.on('quiz-runtime', setQuizSettings);
    }, [socket]);

    return settings;
};
