import { useContext, useEffect } from 'react';

import store from '../../../providers/store';
import { PlayerStateDto, updateScoreboard } from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';

const updateScores = (scores: PlayerStateDto[]) => {
    console.log('update score');
    store.dispatch(updateScoreboard(scores));
};

export const useScoreboard = () => {
    const connection = useContext(socketctx);

    useEffect(() => {
        connection?.on('update-scoreboard', updateScores);

        return () => {
            connection?.off('update-scoreboard', updateScores);
        };
    }, [connection]);
};
