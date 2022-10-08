import { useContext } from 'react';

import { HubContext } from './SignalrContext';

export const useHubConnection = () => {
    return useContext(HubContext).hubConnection;
};
