import { Grid, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type AppLayoutProps = {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const backgroundColor = useColorModeValue(undefined, 'gray.700');
  return (
    <Grid
      gap={8}
      backgroundColor={backgroundColor}
      height='100vh'
      maxHeight='100vh'>
      {children}
    </Grid>

  );
};