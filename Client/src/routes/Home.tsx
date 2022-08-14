import { InteractionType } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsalAuthentication } from '@azure/msal-react';
import React from 'react';

import { AppLayout } from '../components/AppLayout';
import { SignInButton } from '../components/common/SignInSignButton';
import { LandingLayout } from '../components/layouts/LandingLayout';
import { Lobby } from '../features/lobby/routes/Lobby';

export const Home = () => {
  const {login, result, error} = useMsalAuthentication(InteractionType.Redirect);

  return(
    <AppLayout>
      <AuthenticatedTemplate>
        <Lobby/>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LandingLayout>
          <p>Not Authenticated, please login</p>
          <SignInButton/>
        </LandingLayout>
      </UnauthenticatedTemplate>
    </AppLayout>
  );
};