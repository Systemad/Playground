import * as signalR from '@microsoft/signalr';
import React, { createContext, ReactNode, useEffect } from 'react';

import { acquireAccessToken, msalInstance } from '../auth/MsalKey';

const url = 'https://localhost:7069/hub';

type Props = {
    children?: ReactNode;
};

export const socket = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.elapsedMilliseconds < 60000) {
                // If we've been reconnecting for less than 60 seconds so far,
                // wait between 0 and 10 seconds before the next reconnect attempt.
                return Math.random() * 10000;
            } else {
                // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
                return null;
            }
        },
    })
    .withUrl(url, {
        accessTokenFactory: () => acquireAccessToken(msalInstance),
    })
    .build();

export const SocketContext = createContext(socket);

export const SocketProvider = (props: Props) => {
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};

/*

*/
