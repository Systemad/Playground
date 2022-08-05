import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerHeader,
  Flex,
  FlexProps, FormLabel, GridItem,
  Icon,
  IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon,
  Link, Select,   Spacer,
Stack,
  Text, Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { MyParams } from '../../../utils/routerParams';
import { useQuizGetGameRuntimeQuery } from '../api/quizAPI';
import { UseQuizSocket } from '../hooks/UseQuizSocket';
import { Answers } from './Answers';
import { Question } from './Question';

// <LobbyCard title="Game1" gameMode="quiz" gameStatus="inprogress" players="1/4" />

export const QuizLayout = () => {

  const { gameId } = useParams<keyof MyParams>() as MyParams;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {data: quiz} = useQuizGetGameRuntimeQuery({gameId: gameId});
  UseQuizSocket(gameId)

  return (
    <>
      <GridItem bg='papayawhip' area={'main'}>
        <Flex h="10vh">
          <Text color="gray.50" size="lg">
            Question {(quiz?.questionStep!) + 1}/{quiz?.questions}
          </Text>
          <Spacer />
          <Text color="gray.50">Score: {score}</Text>
        </Flex>
        <Stack textAlign="center" h="60vh">
          <Question
            key={quiz?.questionStep}
            question={quiz!.currentQuestion!.question!}
          />
          <Answers
            correctAnswer={questions?.[questionIndex].answer}
            answerChoices={questions?.[questionIndex].answerChoices}
            onClick={handleAnswer}
            disabled={disabled}
          />
        </Stack>
      </GridItem>
    </>
  )
}