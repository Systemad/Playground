import { Box, Flex, ScaleFade, SimpleGrid, Spacer, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { AnswerButton } from '../../../components/common/AnswerButton';
import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { Player, QuizRuntime, Result } from '../api/quizAPI';
import { Chatbox } from '../components/Chatbox';
import { Question } from '../components/Question';

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

  const [preGame, setPreGame] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const { gameId } = useParams<keyof MyParams>() as MyParams;

  /*
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {data: quiz} = useQuizGetGameRuntimeQuery({gameId: gameId});
  */

  const handleAnswer = async (answer: string) => {
    await connection.invoke('submitAnswer', answer);
  };

  /*
    connection.on("NextQuestion", (question: Result) => {
      setDisabled(false);
    })

    UseQuizSocket(gameId)
  */
  return (
    <>
      <Box h="100%" bg="blue" w="full" mx="auto" my="auto" p={6}>
        <ScaleFade initialScale={0.5} in={quiz.gameActive}>
          <Stack textAlign="center" h="60vh">
            <Question
              key={quiz?.questionStep}
              question={quiz!.currentQuestion!.question!}
              step={quiz!.questionStep!}
              total={quiz!.questionStep!}
            />

            <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
              {quiz?.currentQuestion?.incorrect_answers?.map((answer, index) => {
                return (
                  <AnswerButton
                    choice={answer}
                    key={index + answer}
                    onClick={() => handleAnswer(answer)}
                    isDisabled={disabled}
                  >
                    {answer}
                  </AnswerButton>
                );
              })}
            </SimpleGrid>
          </Stack>
        </ScaleFade>

        <Flex borderRadius="md" mt={8} h="15vh" textAlign="center" w="full" mx="auto" bg="blue.200">
          <Flex direction='row'>
            <Box mr={10}>
              <h1>Not ready</h1>
            </Box>
            <Box>
              <h1>Not ready</h1>
            </Box>
            <Box>
              <h1>Not ready</h1>
            </Box>
            <Box>
              <h1>Not ready</h1>
            </Box>
          </Flex>
          <Spacer />
          <Chatbox/>
        </Flex>
      </Box>
    </>
  );
};