import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { QuizRuntime } from '../api/quizAPI';

export const useQuizSettings = () => {
    const [settings, currentSettings] = useState<QuizRuntime>();
    const socket = useContext(SocketContext);
    useEffect(() => {
        const newQuestion = (question: QuizRuntime) =>
            currentSettings(question);

        socket.on('quiz-settings', newQuestion);
    }, [socket]);

    return settings;
};
