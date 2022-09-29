import {
    IPublicClientApplication,
    PublicClientApplication,
} from '@azure/msal-browser';
import * as signalR from '@microsoft/signalr';
import { useEffect, useState } from 'react';

import { acquireAccessToken, msalInstance } from '../../auth/MsalKey';

const url = 'https://localhost:7069/hub';

export const hubConnection = new signalR.HubConnectionBuilder()
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

export const useSignalR = (
    hubConnection: signalR.HubConnection,
    instance: IPublicClientApplication
) => {
    /*
    connection = new signalR.HubConnectionBuilder()
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
*/
    useEffect(() => {
        if (hubConnection.state === signalR.HubConnectionState.Disconnected)
            hubConnection.start();

        return () => {
            hubConnection.stop();
        };
    }, [hubConnection, instance]);
};

export async function JoinGame(gameId: string) {
    if (hubConnection.state !== signalR.HubConnectionState.Connected) return;
    await hubConnection.invoke('JoinGame', gameId);
}

export async function LeaveGame(gameId: string) {
    if (hubConnection.state !== signalR.HubConnectionState.Connected) return;
    await hubConnection.invoke('LeaveGame', gameId);
}
