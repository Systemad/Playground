import {
  Box,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Answers } from '../../../components/common/Answers';
import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { Player, QuizRuntime, Result, useQuizGetGameRuntimeQuery } from '../api/quizAPI';
import { Question } from '../components/Question';
import { Scoreboard } from '../components/Scoreboard';
import { UseQuizSocket } from '../hooks/useQuizSocket';

let ps: Player = {
  id: '1212',
  name: 'whatevs',
};

let p2: Player = {
  id: '19191',
  name: 'nodeiaia',
};

let qs: Result = {
  category: 'Tech',
  type: 'noidea',
  difficulty: 'easy',
  question: 'Who won Hockey',
  correct_answer: 'Sweden',
  incorrect_answers: ['Sweden', 'Finland', 'USA', 'Canada'],
};

let quiz: QuizRuntime = {
  gameActive: true,
  currentQuestion: qs,
  questions: 10,
  questionStep: 1,
  numberOfPlayers: 2,
  players: [ps, p2],
};

export const QuizLayout = () => {

  const [disabled, setDisabled] = useState<boolean>(false);

  const { gameId } = useParams<keyof MyParams>() as MyParams;

  /*
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {data: quiz} = useQuizGetGameRuntimeQuery({gameId: gameId});
  */

  const handleAnswer = async (answer: string) => {

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
      <Box w='full' mx='auto' my='auto' p={6}>
        <Scoreboard step={quiz!.questionStep!} total={quiz!.questions!} />
        <Stack textAlign='center' h='60vh'>
          <Question
            key={quiz?.questionStep}
            question={quiz!.currentQuestion!.question!}
          />
          <Answers
            disabled={disabled}
            choices={quiz?.currentQuestion?.incorrect_answers}
            onClick={handleAnswer}
          />
        </Stack>
      </Box>
    </>
  );
};