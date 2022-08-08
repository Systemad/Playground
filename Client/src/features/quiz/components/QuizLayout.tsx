import {
  GridItem,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { useQuizGetGameRuntimeQuery } from '../api/quizAPI';
import { UseQuizSocket } from '../hooks/useQuizSocket';
import { Root } from '../Question';
import { Answers } from './Answers';
import { Question } from './Question';
import { Scoreboard } from './Scoreboard';

// <LobbyCard title="Game1" gameMode="quiz" gameStatus="inprogress" players="1/4" />

export const QuizLayout = () => {

  const { gameId } = useParams<keyof MyParams>() as MyParams;
  const [disabled, setDisabled] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {data: quiz} = useQuizGetGameRuntimeQuery({gameId: gameId});
  

  const handleAnswer = (answer: string) => {
    setDisabled(true);
    

    // do toast stuff,
    // send answer to server, let it calculate score, then send scoreboard event, and let Scoreboard component handle it
  }
  // dosomething
  /*
    connection.on(nextround){
      setDisabled(false);
      setCurrentQuestiont to something else
      remove toast
      usecallback??, create function here, call it from hook
    }
   */
  connection.on("NextQuestion", (question: Root) => {
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