import { useContext, useEffect, useState } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';

export const useUsersReady = () => {
    const [usersReady, setUsersReady] = useState<boolean>(false);
    const hubConnection = useHubConnection();
    useEffect(() => {
        hubConnection?.on('all-users-ready', (status: boolean) => {
            console.log('all-users-ready');
            setUsersReady(status);
        });
    }, [hubConnection]);

    return usersReady;
};
