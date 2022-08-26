import { Flex } from '@chakra-ui/react'
import React from 'react'

interface IProps {
    children: React.ReactNode
}

export const LandingLayout: React.FC<IProps> = ({ children }) => (
    <Flex direction="column" align="center" maxW={{ xl: '1200px' }} m="0 auto">
        {children}
    </Flex>
)
