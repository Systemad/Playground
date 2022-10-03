import { InteractionType } from '@azure/msal-browser';
import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
    useMsalAuthentication,
} from '@azure/msal-react';
import * as signalR from '@microsoft/signalr';
import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { UnauthenticatedLayout } from '../components/layouts/UnauthenticatedLayout';
import { LobbyPage } from '../features/lobby';
import { Quiz, QuizHome, QuizResults } from '../features/quiz/';
import { UserPage } from '../features/user';
import { SocketContext } from '../utils/contexts/SignalrContext';

export const AppRoutes = () => {
    const socket = useContext(SocketContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { login, result, error } = useMsalAuthentication(
        InteractionType.Redirect
    );

    useEffect(() => {
        if (socket.state === signalR.HubConnectionState.Disconnected)
            socket.start();

        //return () => {
        //    socket.stop();
        //};
    }, [socket]);
    return (
        <>
            <AuthenticatedTemplate>
                <Routes>
                    <Route index element={<LobbyPage />} />

                    <Route path="/quiz" element={<QuizHome />} />
                    <Route path="/quiz/:gameId" element={<Quiz />} />
                    <Route
                        path="/quiz/:gameId/results"
                        element={<QuizResults />}
                    />

                    <Route path="/profile" element={<UserPage />} />
                </Routes>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <UnauthenticatedLayout />
            </UnauthenticatedTemplate>
        </>
    );
};
