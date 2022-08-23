import { Box, Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import { AppLayout } from '../../../components/AppLayout';
import { Sidebar } from '../../../components/layouts/Sidebar'
import { CreateQuizLayout, QuizLayout } from '../index';

export const QuizHome = () => {
  return(
    <Box w="full" mx='auto' my='auto' p={6}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Stack>
          <CreateQuizLayout/>
        </Stack>

      </SimpleGrid>

    </Box>
  );
};