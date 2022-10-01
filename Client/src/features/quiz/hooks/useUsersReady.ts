import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';

export const useUsersReady = () => {
    const [usersReady, setUsersReady] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on('users-ready', (status: boolean) => {
            setUsersReady(status);
        });
    });

    return usersReady;
};
