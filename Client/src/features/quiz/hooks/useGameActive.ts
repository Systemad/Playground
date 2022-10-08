import { useEffect, useState } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';

export const useGameActive = () => {
    const [active, setActive] = useState<boolean>(false);
    const hubConnection = useHubConnection();
    useEffect(() => {
        hubConnection?.on('start-game', () => {
            setActive(true);
        });
    }, [hubConnection]);

    useEffect(() => {
        hubConnection?.on('stop-game', () => {
            setActive(false);
        });
    }, [hubConnection]);

    return active;
};
