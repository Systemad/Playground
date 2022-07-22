import { InteractionType } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsalAuthentication } from '@azure/msal-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AppLayout } from '../components/AppLayout';
import { SignInButton } from '../components/common/SignInSignButton';
import { LandingLayout } from '../components/layouts/LandingLayout';
import { Sidebar } from '../components/layouts/Sidebar';
import { Lobby } from './Lobby';

/*
export declare enum InteractionType {
    Redirect = "redirect",
    Popup = "popup",
    Silent = "silent",
    None = "none"
}
 */
export const Home = () => {
  const navigate = useNavigate();
  const {login, result, error} = useMsalAuthentication(InteractionType.Redirect);

  return(
    <AppLayout>
      <AuthenticatedTemplate>
        <Sidebar/>
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