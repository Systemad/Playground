import { Box, Button, GridItem, Heading, Progress,Stack, useToast } from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Difficulty } from '../../enums';
import { useGetCategoriesQuery } from '../api/CategoryAPI';
import { QuizSettingsModel, useQuizCreateGameMutation } from '../api/quizAPI';
import { CategoryChooser } from '../components/CategoryChooser';
import { DifficultyChooser } from '../components/DifficultyChooser';

export interface DifficultyLevel {
  id: string;
  name: string;
}

export const CreateQuizLayout = () => {
  let content;

  let settings: QuizSettingsModel = {
    name: "aaa",
    questions: 1,
    category: "1",
    difficulty: Difficulty.Easy
  }

  const navigate = useNavigate();
  const toast = useToast()
  const [create, result] = useQuizCreateGameMutation();


  const difficulties: DifficultyLevel[] = [
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
  ];

  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCategoriesQuery();

  const handleCategoryChange = ({ target: { value }, }: ChangeEvent<HTMLInputElement>) => settings.category = value;
  const handleDifficultyChange = ({ target: { value }, }: ChangeEvent<HTMLSelectElement>) =>
  {
    if(value === 'easy')
      settings.difficulty = Difficulty.Easy;
    if(value === 'medium')
      settings.difficulty = Difficulty.Medium;
    if(value === 'hard')
      settings.difficulty = Difficulty.Hard;
  }

  const handleCreateQuiz = async () => {
    try {
      await create({quizSettingsModel: settings});
      if(result)
        navigate(`quiz/${result}`);


    }catch{
      toast({
        title: 'An error occurred',
        description: "We couldn't save your post, try again!",
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  if (isLoading) {
    content = <Progress size='xs' isIndeterminate />;
  } else if (isSuccess) {
    content = (
      <>
        <CategoryChooser label="category" categories={categories} onChange={handleDifficultyChange} />
        <DifficultyChooser label="difficulty" categories={difficulties} onChange={handleDifficultyChange} />

        <Button onClick={() => handleCreateQuiz()} w={['100%']}>
          Create quiz
        </Button>
      </>
    );
  } else if (isError) {
    content = (
      <Heading as="h1" color="gray.50" textAlign="center">
        {"error"}
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