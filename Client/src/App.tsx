import { IPublicClientApplication } from '@azure/msal-browser';
// MSAL imports
import { MsalProvider } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { Home } from './routes/Home';

import { CustomNavigationClient } from './utils/auth/NavigationClient';

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
                <Home />
            </MsalProvider>
        </>
    );
}

export default App;
