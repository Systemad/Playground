import {PublicClientApplication} from "@azure/msal-browser";
import * as signalR from "@microsoft/signalr";

import {loginRequest, msalConfig} from "../../auth/AuthConfig";

const url = "https://localhost:7256/mainhub";
const msalInstance = new PublicClientApplication(msalConfig);

const acquireAccessToken = async (msalInstance: any) => {
  const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const accounts = msalInstance.getAllAccounts();
  if (!activeAccount && accounts.length === 0) {
    /*
     * User is not signed in. Throw error or wait for user to login.
     * Do not attempt to log a user in outside the context of MsalProvider
     */
  }
  const request = {
    scopes: loginRequest.scopes,
    account: activeAccount || accounts[0],
  };

  const authResult = await msalInstance.acquireTokenSilent(request);

  return authResult.accessToken;
};

const connection = new signalR.HubConnectionBuilder()
  .withAutomaticReconnect()
  .withUrl(url, {accessTokenFactory: () => acquireAccessToken(msalInstance)})
  .build();

export default connection;