import { useEffect, useState } from 'react';

import { useHubConnection } from '../utils/api/signalr/useHubConnection';

enum Events {
    StartTimer = 'StartTimer',
    StopTimer = 'StopTimer',
    ResetTimer = 'ResetTimer',
}
// TODO: No timer implemented in backend, so ignore for now!
export function UseTimer(duration: number) {
    const [isRunning, setIsRunning] = useState(false);
    const hubConnection = useHubConnection();

    useEffect(() => {
        hubConnection?.on(Events.StartTimer, (timer: boolean) => {
            setIsRunning(true);
        });

        hubConnection?.on(Events.StopTimer, (timer: boolean) => {
            setIsRunning(false);
        });

        hubConnection?.on(Events.ResetTimer, (timer: boolean) => {
            setIsRunning(true);
        });
    }, [hubConnection, isRunning]);
}
