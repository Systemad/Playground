import { useContext, useEffect, useState } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';
import { PlayerState } from '../api/quizAPI';

export const useScoreboard = () => {
    const [scoreboard, setScoreboard] = useState<PlayerState[]>([]);
    const hubConnection = useHubConnection();
    useEffect(() => {
        const updateScoreboard = (scores: PlayerState[]) => {
            console.log('socreboatd-fetched');
            setScoreboard(scores);
        };

        hubConnection?.on('update-scoreboard', updateScoreboard);
    }, [hubConnection]);

    return scoreboard;
};
