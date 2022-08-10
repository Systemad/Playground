import {
  GridItem,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { Result, useQuizGetGameRuntimeQuery } from '../api/quizAPI';
import { Answers } from '../components/Answers';
import { Question } from '../components/Question';
import { Scoreboard } from '../components/Scoreboard';
import { UseQuizSocket } from '../hooks/useQuizSocket';

export const QuizLayout = () => {

  const { gameId } = useParams<keyof MyParams>() as MyParams;
  const [disabled, setDisabled] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {data: quiz} = useQuizGetGameRuntimeQuery({gameId: gameId});

  const handleAnswer = (answer: string) => {
    setDisabled(true);
  }

  connection.on("NextQuestion", (question: Result) => {
    setDisabled(false);
  })

  UseQuizSocket(gameId)

  return (
    <>
      <GridItem bg='papayawhip' area={'main'}>
        <Scoreboard step={quiz!.questionStep!} total={quiz!.questions!}/>
        <Stack textAlign="center" h="60vh">
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
      </GridItem>
    </>
  )
}