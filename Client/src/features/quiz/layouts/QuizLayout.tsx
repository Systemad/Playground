import { Box, SimpleGrid, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { AnswerButton } from '../../../components/common/AnswerButton';
import { MyParams } from '../../../utils/routerParams';
import { Player, QuizRuntime, Result } from '../api/quizAPI';
import { Question } from '../components/Question';
import { Scoreboard } from '../components/Scoreboard';

const ps: Player = {
  id: '1212',
  name: 'whatevs'
};

const p2: Player = {
  id: '19191',
  name: 'nodeiaia'
};

const qs: Result = {
  category: 'Tech',
  type: 'noidea',
  difficulty: 'easy',
  question: 'Who won Hockey',
  correct_answer: 'Sweden',
  incorrect_answers: ['Sweden', 'Finland', 'USA', 'Canada']
};

const quiz: QuizRuntime = {
  gameActive: true,
  currentQuestion: qs,
  questions: 10,
  questionStep: 1,
  numberOfPlayers: 2,
  players: [ps, p2]
};

export const QuizLayout = () => {

  const [disabled, setDisabled] = useState<boolean>(false);
  const { gameId } = useParams<keyof MyParams>() as MyParams;

  /*
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {data: quiz} = useQuizGetGameRuntimeQuery({gameId: gameId});
  */

  /*
  const handleCategoryChange = ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => settings.category = value;
   */
  const handleAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2500);

  };

  /*
    connection.on("NextQuestion", (question: Result) => {
      setDisabled(false);
    })

    UseQuizSocket(gameId)
  */
  return (
    <>
      <Box w="full" mx="auto" my="auto" p={6}>
        <Scoreboard step={quiz!.questionStep!} total={quiz!.questions!} />
        <Stack textAlign="center" h="60vh">
          <Question
            key={quiz?.questionStep}
            question={quiz!.currentQuestion!.question!}
          />

          <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
            {quiz?.currentQuestion?.incorrect_answers?.map((answer, index) => {
              return (
                <AnswerButton
                  choice={answer}
                  key={index + answer}
                  onClick={handleAnswer(answer)}
                  isDisabled={disabled}
                >
                  {answer}
                </AnswerButton>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Box>
    </>
  );
};