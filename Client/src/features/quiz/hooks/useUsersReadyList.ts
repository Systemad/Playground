import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';

export type PlayerReadyData = {
    id: string;
    name: string;
    ready: boolean;
};
export const useUsersReadyList = () => {
    const [usersReady, setUsersReady] = useState<PlayerReadyData[]>();
    const connection = useContext(socketctx);
    useEffect(() => {
        const usersReadyListener = (players: PlayerReadyData[]) => {
            console.log('pre-game-users');
            setUsersReady(players);
        };
        connection?.on('pre-game-users', usersReadyListener);

        return () => {
            connection?.off('pre-game-users', usersReadyListener);
        };
    }, [connection]);

    return usersReady;
};
