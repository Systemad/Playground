import * as signalR from '@microsoft/signalr';

import { acquireAccessToken, msalInstance } from '../../auth/MsalKey';

const url = 'https://localhost:7069/hub';

const connection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl(url, {
        accessTokenFactory: () => acquireAccessToken(msalInstance),
    })
    .build();

export default connection;

export async function JoinGame(gameId: string) {
    //if (connection.state === signalR.HubConnectionState.Connected) return;
    if (connection.state !== signalR.HubConnectionState.Connected) return;
    await connection.invoke('JoinGame', gameId);
}

export async function LeaveGame(gameId: string) {
    if (connection.state !== signalR.HubConnectionState.Connected) return;
    await connection.invoke('LeaveGame', gameId);
}
