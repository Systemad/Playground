import { Box, SimpleGrid, Stack } from '@chakra-ui/react';
import React from 'react';

import { CreateQuizComponent } from '../components/CreateQuizComponent';

export const QuizHome = () => {
    return (
        <Box w="full" mx="auto" my="auto" p={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                <Stack>
                    <CreateQuizComponent />
                </Stack>
            </SimpleGrid>
        </Box>
    );
};
