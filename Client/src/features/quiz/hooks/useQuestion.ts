import { useContext, useEffect, useState } from 'react';

import store from '../../../providers/store';
import { updateQuestion } from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { ProcessedQuestion } from '../api/quizAPI';

const newQuestion = (question: ProcessedQuestion) => {
    console.log('useQuestion: new qustion');
    store.dispatch(updateQuestion(question));
};

const resetQustion = () => {
    console.log('useQuestion: finish-qeustion');
    store.dispatch(resetQustion);
};

export const useQuestion = () => {
    const connection = useContext(socketctx);

    useEffect(() => {
        connection?.on('new-question', newQuestion);
        return () => {
            connection?.off('new-question', newQuestion);
        };
    }, [connection]);

    useEffect(() => {
        connection?.on('finish-question', resetQustion);
        return () => {
            connection?.off('finish-question', resetQustion);
        };
    }, [connection]);
};
