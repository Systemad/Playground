import * as signalR from '@microsoft/signalr'

import { acquireAccessToken, msalInstance } from '../../auth/MsalKey'

const url = 'https://localhost:7069/hub'

const connection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl(url, {
        accessTokenFactory: () => acquireAccessToken(msalInstance),
    })
    .build()

export default connection
