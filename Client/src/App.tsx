import { IPublicClientApplication } from '@azure/msal-browser'
// MSAL imports
import { MsalProvider, useMsal } from '@azure/msal-react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from './components/AppLayout'
import { Sidebar } from './components/layouts/Sidebar'
import { AppRoutes } from './routes/Routes'
import { CustomNavigationClient } from './utils/auth/NavigationClient'
import * as signalR from '@microsoft/signalr'
import connection from './utils/api/signalr/Socket'

type AppProps = {
    pca: IPublicClientApplication
}

function App({ pca }: AppProps) {
    const history = useNavigate()
    const navigationClient = new CustomNavigationClient(history)
    pca.setNavigationClient(navigationClient)

    const { instance, accounts, inProgress } = useMsal()
    const startConnection = async () => {
        if (connection.state === signalR.HubConnectionState.Connected) return

        if (connection.state === signalR.HubConnectionState.Disconnected)
            await connection.start()
    }

    useEffect(() => {
        startConnection().then((r) => console.log(r))
    }, [accounts, instance])

    return (
        <>
            <MsalProvider instance={pca}>
                <AppLayout>
                    <Sidebar />

                    <Box
                        h="100vh"
                        ml={{ base: 0, md: 60 }}
                        p="4"
                        transition=".3s ease"
                    >
                        <AppRoutes />
                    </Box>
                </AppLayout>
            </MsalProvider>
        </>
    )
}

export default App
