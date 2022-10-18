import { Box } from '@chakra-ui/react';
import React from 'react';

type AppLayoutProps = {
    children: React.ReactNode;
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <Box as="section" h="100vh">
            {children}
        </Box>
    );
};
