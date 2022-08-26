import { InteractionType } from '@azure/msal-browser'
import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
    useMsalAuthentication,
} from '@azure/msal-react'
import React from 'react'

import { UnauthenticatedLayout } from '../../../components/layouts/UnauthenticatedLayout'
import { LobbyLayout } from '../layouts/LobbyLayout'

export const Lobby = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { login, result, error } = useMsalAuthentication(
        InteractionType.Redirect
    )
    return (
        <>
            <AuthenticatedTemplate>
                <LobbyLayout />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <UnauthenticatedLayout />
            </UnauthenticatedTemplate>
        </>
    )
}
