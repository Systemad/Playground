import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';

export const useUsersReady = () => {
    const [usersReady, setUsersReady] = useState<boolean>(false);
    const connection = useContext(socketctx);
    useEffect(() => {
        const usersReadyListener = (status: boolean) => {
            console.log('all-users-ready');
            setUsersReady(status);
        };
        connection?.on('all-users-ready', usersReadyListener);

        return () => {
            connection?.off('all-users-ready', usersReadyListener);
        };
    }, [connection]);

    return usersReady;
};
