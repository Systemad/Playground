/* eslint-disable no-console */
import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
} from '@microsoft/signalr';
import React, {
    createContext,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';

import { loginRequest } from '../../auth/AuthConfig';

const HUB_CONNECTION_URL = process.env.HUB_CONNECTION_URL;
const useHubContextInit = () => {
    const ref = useRef<HubConnection | null>(null);
    const { instance, accounts, inProgress } = useMsal();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function startConnection() {
            if (
                !loading &&
                inProgress === InteractionStatus.None &&
                accounts.length > 0
            ) {
                if (!HUB_CONNECTION_URL) {
                    return;
                }

                const acquireToken = async () => {
                    const activeAccount = instance.getActiveAccount();
                    if (!activeAccount && accounts.length === 0) {
                        /*
                         */
                    }

                    const request = {
                        scopes: loginRequest.scopes,
                        account: activeAccount || accounts[0],
                    };

                    const authResult = await instance.acquireTokenSilent(
                        request
                    );
                    return authResult.accessToken;
                };

                ref.current = new HubConnectionBuilder()
                    .withUrl(HUB_CONNECTION_URL, {
                        accessTokenFactory: () => acquireToken(),
                        transport: HttpTransportType.WebSockets,
                        skipNegotiation: true,
                    })
                    .withAutomaticReconnect()
                    .build();

                if (!HUB_CONNECTION_URL || !ref.current) {
                    return;
                }

                const hubConnection = ref.current;

                if (hubConnection.state === HubConnectionState.Disconnected) {
                    await hubConnection.start();
                    setLoading(false);
                    //const startPromise = hubConnection
                    //    .start()
                    //    .then(() => setLoading(false))
                    //   .catch();

                    return async () => {
                        await hubConnection.stop();
                        //startPromise.then(() => {
                        //    hubConnection.stop();
                        //});
                    };
                }
            }
        }
        startConnection();
    }, [accounts, inProgress, instance, loading]);

    return {
        hubConnection: ref.current,
    };
};

type HubContextValue = ReturnType<typeof useHubContextInit>;

export const HubContext = createContext<HubContextValue>({
    hubConnection: null,
});

export const HubContextProvider = ({ children }: { children: ReactNode }) => {
    const hubConnection = useHubContextInit();
    return (
        <HubContext.Provider value={hubConnection}>
            {children}
        </HubContext.Provider>
    );
};
