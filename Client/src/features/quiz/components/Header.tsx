import { Box, Progress, Text } from '@chakra-ui/react';
import React from 'react';

import { Scoreboard } from './Scoreboard';

type Props = {
    currentQuestion?: string;
    step?: number;
    total?: number;
};

export const Header = ({ currentQuestion }: Props) => {
    return (
        <Box
            borderRadius="md"
            bgColor="#4C566A"
            w="full"
            mx="auto"
            my="auto"
            p={6}
        >
            <Scoreboard step={1} total={10} />
            <Box>
                <Text fontSize={['xl', '2xl', '4xl']} color="white" h="60%">
                    {currentQuestion}
                </Text>
            </Box>

            <Box pt={20} mx="auto" my="auto">
                <Progress borderRadius="md" value={20} />
            </Box>
        </Box>
    );
};
