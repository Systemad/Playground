import { PublicClientApplication } from '@azure/msal-browser'

import { loginRequest, msalConfig } from './AuthConfig'

export const msalInstance = new PublicClientApplication(msalConfig)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const acquireAccessToken = async (msalInstance: any) => {
    const activeAccount = msalInstance.getActiveAccount() // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
    const accounts = msalInstance.getAllAccounts()
    if (!activeAccount && accounts.length === 0) {
        /*
         * User is not signed in. Throw error or wait for user to login.
         * Do not attempt to log a user in outside the context of MsalProvider
         */
    }
    const request = {
        scopes: loginRequest.scopes,
        account: activeAccount || accounts[0],
    }

    const authResult = await msalInstance.acquireTokenSilent(request)
    return authResult.accessToken
}
