import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { PlayerState } from '../api/quizAPI';

export const useScoreboard = () => {
    const [scoreboard, setScoreboard] = useState<PlayerState[]>([]);
    const socket = useContext(SocketContext);
    useEffect(() => {
        const updateScoreboard = (scores: PlayerState[]) =>
            setScoreboard(scores);

        socket.on('update-scoreboard', updateScoreboard);
    }, [socket]);

    return scoreboard;
};
