import { Box, Flex, Progress, Spacer, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
    currentQuestion?: string;
    step: number;
    total?: number;
};

export const Header = ({ currentQuestion, step, total }: Props) => {
    return (
        <Box
            borderRadius="md"
            bgColor="#4C566A"
            w="full"
            mx="auto"
            my="auto"
            p={6}
        >
            <Flex h="10vh">
                <Text color="white" size="lg">
                    Question {step + 1}/{total}
                </Text>
                <Spacer />
            </Flex>
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