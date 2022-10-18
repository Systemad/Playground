import { InteractionType } from '@azure/msal-browser';
import { useMsalAuthentication } from '@azure/msal-react';

import { GameBrowserLayout } from '../layouts/GameBrowserLayout';

export const GameBrowserPage = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { login, result, error } = useMsalAuthentication(
        InteractionType.Redirect
    );
    return (
        <>
            <GameBrowserLayout />
        </>
    );
};

/*
            <AuthenticatedTemplate>
                <LobbyLayout />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <UnauthenticatedLayout />
            </UnauthenticatedTemplate>
            */
