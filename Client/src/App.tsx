import { IPublicClientApplication } from "@azure/msal-browser";
// MSAL imports
import { MsalProvider } from "@azure/msal-react";

import { AppRoutes } from './routes/Routes';
import { CustomNavigationClient } from "./utils/auth/NavigationClient";
import { useNavigate } from 'react-router-dom';


type AppProps = {
  pca: IPublicClientApplication
};

function App({ pca }: AppProps) {
  const history = useNavigate();
  const navigationClient = new CustomNavigationClient(history);
  pca.setNavigationClient(navigationClient);

  return (
    <>
      <MsalProvider instance={pca}>
        <AppRoutes/>
      </MsalProvider>
    </>
  );
}

export default App;