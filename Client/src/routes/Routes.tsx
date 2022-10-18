import { InteractionType } from '@azure/msal-browser';
import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
    useMsalAuthentication,
} from '@azure/msal-react';
import { Route, Routes } from 'react-router-dom';

import { UnauthenticatedLayout } from '../components/layouts/UnauthenticatedLayout';
import { UserPage } from '../features/user';

export const AppRoutes = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { login, result, error } = useMsalAuthentication(
        InteractionType.Redirect
    );
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
