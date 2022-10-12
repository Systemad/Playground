import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { PlayerState } from '../api/quizAPI';

export const useScoreboard = () => {
    const [scoreboard, setScoreboard] = useState<PlayerState[]>([]);
    const connection = useContext(socketctx);
    useEffect(() => {
        const updateScoreboard = (scores: PlayerState[]) => {
            console.log('update score');
            setScoreboard(scores);
        };

        connection?.on('update-scoreboard', updateScoreboard);

        return () => {
            connection?.off('update-scoreboard', updateScoreboard);
        };
    }, [connection]);

    return scoreboard;
};
