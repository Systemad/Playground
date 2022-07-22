import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Theme from "./theme"

// MSAL imports
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from "@azure/msal-browser";
import { msalConfig } from "./utils/auth/AuthConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider theme={Theme} >
        <App pca={msalInstance} />
      </ChakraProvider>
    </React.StrictMode>,
  document.getElementById('root'),
);
