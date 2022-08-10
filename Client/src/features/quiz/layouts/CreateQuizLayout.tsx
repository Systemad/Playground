import {
  Box,
  Button,
  GridItem, Heading, SelectField,
  Stack,
} from '@chakra-ui/react';

import { Difficulty } from '../../enums';
import { useGetCategoriesQuery } from '../api/CategoryAPI';
import { useQuizCreateGameMutation } from '../api/quizAPI';
import { CategoryChooser } from '../components/CategoryChooser';

export const CreateQuizLayout = () => {
  let content;

  const [creategame] = useQuizCreateGameMutation();

  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCategoriesQuery();

  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (isSuccess) {
    content = (
      <>
        <CategoryChooser label="category" categories={categories} onChange={handleChange} />


        <Button onClick={() => navigate('/quiz')} w={['100%']}>
          Begin Quiz
        </Button>
      </>
    );
  } else if (isError) {
    content = (
      <Heading as="h1" color="gray.50" textAlign="center">
        {error}
      </Heading>
    );
  }

  return (
    <>
      <GridItem bg='papayawhip' area={'main'}>
        <Stack spacing={8} p={2} h="95vh" align="center" justify="center">
          <Box>
            <img
              width="640"
              height="360"
              src=""
              alt="quizler"
            />
          </Box>
          <Stack align="center" spacing={3} h={256}>
            {content}
          </Stack>
        </Stack>
      </GridItem>
    </>
  )
}