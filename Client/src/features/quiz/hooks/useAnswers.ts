import { useContext, useEffect, useState } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';

export const useAnswers = () => {
    const [answers, setAnswers] = useState<string[]>();
    const hubConnection = useHubConnection();
    useEffect(() => {
        const setAnswer = (answers: string[]) => {
            console.log('answers-receive');
            setAnswers(answers);
        };
        hubConnection?.on('new-question', setAnswer);

        //return () => {
        //    socket.off('new-question', setAnswer);
        //};
    }, [hubConnection]); // socket as dependcy?

    useEffect(() => {
        const setAnswer = () => setAnswers([]);

        hubConnection?.on('finish-question', setAnswer);

        //return () => {
        //    socket.off('finish-question', setAnswer);
        //};
    }, [hubConnection]);

    return answers;
};
