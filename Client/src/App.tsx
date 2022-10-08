import { IPublicClientApplication } from '@azure/msal-browser';
// MSAL imports
import { MsalProvider } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import { AppRoutes } from './routes/Routes';
import { CustomNavigationClient } from './utils/auth/NavigationClient';
import { SimpleSidebar } from './components/layouts/Sidebar/Sidebar';

import { HubContextProvider } from './utils/api/signalr/SignalrContext';

type AppProps = {
    pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {
    const history = useNavigate();
    const navigationClient = new CustomNavigationClient(history);
    pca.setNavigationClient(navigationClient);
    return (
        <>
            <MsalProvider instance={pca}>
                <HubContextProvider>
                    <AppRoutes />
                </HubContextProvider>
            </MsalProvider>
        </>
    );
}

export default App;
