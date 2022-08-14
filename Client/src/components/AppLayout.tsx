import { Grid } from '@chakra-ui/react';
import React from 'react';

interface AppLayoutProps {
  showLastColumn?: boolean | null;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
  <Grid
    templateAreas={`
                  "nav main"
                  "nav main"`}
    height="100vh"
    templateColumns={'200px auto'}
    templateRows="100vh">
    {children}
  </Grid>
);