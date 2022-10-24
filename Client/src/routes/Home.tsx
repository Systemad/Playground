import { InteractionType } from '@azure/msal-browser';
import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
    useMsalAuthentication,
} from '@azure/msal-react';
import {
    HttpTransportType,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';

import { AppLayout } from '../components/AppLayout';
import { SimpleSidebar } from '../components/layouts/Sidebar';
import { UnauthenticatedLayout } from '../components/layouts/UnauthenticatedLayout';
import { QuizHome } from '../features/quiz/';
import { ConnectionProvider } from '../utils/api/signalr/ContextV2';
import { acquireAccessToken, msalInstance } from '../utils/auth/MsalKey';
import { Test } from './Test';

const connection = new HubConnectionBuilder()
    .withUrl('https://localhost:7069/hubs/quiz', {
        accessTokenFactory: () => acquireAccessToken(msalInstance),
        transport: HttpTransportType.WebSockets,
        skipNegotiation: true,
    })
    .configureLogging(LogLevel.Debug)
    //.withAutomaticReconnect()
    .build();

export const Home = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { login, result, error } = useMsalAuthentication(
        InteractionType.Redirect
    );

    return (
        <>
            <AuthenticatedTemplate>
                <ConnectionProvider connection={connection}>
                    <SimpleSidebar>
                        <Test />
                    </SimpleSidebar>
                </ConnectionProvider>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <UnauthenticatedLayout />
            </UnauthenticatedTemplate>
        </>
    );
};
