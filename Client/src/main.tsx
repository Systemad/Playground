// MSAL imports
import {
    AuthenticationResult,
    EventMessage,
    EventType,
    PublicClientApplication,
} from '@azure/msal-browser'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { store } from './providers/store'
import theme from './theme'
import { msalConfig } from './utils/auth/AuthConfig'

export const msalInstance = new PublicClientApplication(msalConfig)

const accounts = msalInstance.getAllAccounts()
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0])
}

msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult
        const account = payload.account
        msalInstance.setActiveAccount(account)
    }
})

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(
    <>
        <React.StrictMode>
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <Provider store={store}>
                        <ColorModeScript
                            initialColorMode={theme.config.initialColorMode}
                        />
                        <App pca={msalInstance} />
                    </Provider>
                </BrowserRouter>
            </ChakraProvider>
        </React.StrictMode>
    </>
)
