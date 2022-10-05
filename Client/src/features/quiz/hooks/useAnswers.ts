import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';

export const useAnswers = () => {
    const [answers, setAnswers] = useState<string[]>();
    const socket = useContext(SocketContext);
    useEffect(() => {
        const setAnswer = (answers: string[]) => {
            console.log('answers-receive');
            setAnswers(answers);
        };
        socket.on('new-question', setAnswer);

        //return () => {
        //    socket.off('new-question', setAnswer);
        //};
    }, [socket]);

    useEffect(() => {
        const setAnswer = () => setAnswers([]);

        socket.on('finish-question', setAnswer);

        //return () => {
        //    socket.off('finish-question', setAnswer);
        //};
    }, [socket]);

    return answers;
};
