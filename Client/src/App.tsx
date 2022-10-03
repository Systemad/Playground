import { IPublicClientApplication } from '@azure/msal-browser';
// MSAL imports
import { MsalProvider, useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import { AppRoutes } from './routes/Routes';
import { CustomNavigationClient } from './utils/auth/NavigationClient';
import { SimpleSidebar } from './components/layouts/Sidebar/Sidebar';
import { SocketProvider } from './utils/contexts/SignalrContext';

type AppProps = {
    pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {
    const history = useNavigate();
    const navigationClient = new CustomNavigationClient(history);
    pca.setNavigationClient(navigationClient);
    //const { instance, accounts, inProgress } = useMsal();

    //useSignalR(hubConnection, instance);
    //useEffect(() => {}, [accounts, instance]);

    return (
        <>
            <MsalProvider instance={pca}>
                <SocketProvider>
                    <AppLayout>
                        <SimpleSidebar>
                            <AppRoutes />
                        </SimpleSidebar>
                    </AppLayout>
                </SocketProvider>
            </MsalProvider>
        </>
    );
}

export default App;
