import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';

export const useUsersReady = () => {
    const [usersReady, setUsersReady] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on('all-users-ready', (status: boolean) => {
            console.log('all-users-ready');
            setUsersReady(status);
        });
    });

    return usersReady;
};
