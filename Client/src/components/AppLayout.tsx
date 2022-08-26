import { Box } from '@chakra-ui/react'
import React from 'react'

type AppLayoutProps = {
    children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <Box as="section" bg="gray.50" _dark={{ bg: 'gray.700' }} minH="100vh">
            {children}
        </Box>
    )
}
