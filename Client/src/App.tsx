import { IPublicClientApplication } from "@azure/msal-browser";
// MSAL imports
import { MsalProvider } from "@azure/msal-react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { AppRoutes } from "./routes/Routes";
import { CustomNavigationClient } from "./utils/auth/NavigationClient";

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
        <Layout>
          <AppRoutes />
        </Layout>
      </MsalProvider>
    </>
  );
}

export default App;

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const backgroundColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Box
      height="100vh"
      maxHeight="100vh"
      backgroundColor={backgroundColor}
      transition="0.5s ease-out"
    >
      <Box height="100vh" maxHeight="100vh" as="main">
        {children}
      </Box>
    </Box>
  );
};
