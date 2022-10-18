import { useContext, useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import { PlayerStateDto, updateScoreboard } from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';

export const useScoreboard = () => {
    const connection = useContext(socketctx);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const updateScores = (scores: PlayerStateDto[]) => {
            console.log('update score');
            dispatch(updateScoreboard(scores));
        };

        connection?.on('update-scoreboard', updateScores);

        return () => {
            connection?.off('update-scoreboard', updateScores);
        };
    }, [connection, dispatch]);
};
